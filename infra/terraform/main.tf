data "aws_vpc" "default" {
    default = true
}

data "aws_subnets" "default" {
    filter {
        name    = "vpc-id"
        values  = [data.aws_vpc.default.id]
    }
}

data "aws_ami" "ubuntu" {
    most_recent = true
    owners      = ["099720109477"]

    filter {
        name = "name"
        values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
    }

    filter {
        name    = "virtualization-type"
        values = ["hvm"]
    }
}

resource "aws_security_group" "stackwatch_sg" {
    name    = "${var.project_name}-sg"
    description = "Security group for StackWatch EC2"
    vpc_id  = data.aws_vpc.default.id

    ingress {
        description = "SSH"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = [var.allowed_ssh_cidr]
    }

    ingress {
        description = "Frontend dev port"
        from_port   = 5173
        to_port     = 5173
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "Backend API port"
        from_port   = 3000
        to_port     = 3000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        description = "Allow all outbound traffic"
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name    = "${var.project_name}-sg"
        Project = var.project_name
    }
}

resource "aws_instance" "stackwatch_ec2" {
    ami                         = data.aws_ami.ubuntu.id
    instance_type               = var.instance_type
    key_name                    = var.key_name
    subnet_id                   = data.aws_subnets.default.ids[0]
    vpc_security_group_ids      = [aws_security_group.stackwatch_sg.id]
    associate_public_ip_address = true

    user_data = <<-EOF
                #!/bin/bash
                set -eux

                # Log user_data output for debugging

                exec  > /var/log/user-data.log 2>&1

                # Update packages
                apt update -y

                # Install Docker
                apt install -y docker.io git docker-compose-v2 curl

                # Start and enable Docker
                systemctl start docker
                systemctl enable docker

                # Let ubuntu use Docker without sudo
                usermod -aG docker ubuntu

                # Move into ubuntu home
                cd /home/ubuntu

                # Clone the repo only if it does not already exist
                if [ ! -d "StackWatch" ]; then
                    git clone https://github.com/Jameboyyy/StackWatch.git
                fi

                TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \
                    -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

                PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
                    http://169.254.169.254/latest/meta-data/public-ipv4)

                cd /home/ubuntu/StackWatch/frontend

                # Create frontend env file with the current instance public IP
                cat > .env <<ENVEOF
                VITE_API_BASE_URL=http://$PUBLIC_IP:3000
                ENVEOF

                # Start the app
                cd /home/ubuntu/StackWatch
                docker compose up -d --build

                EOF

    tags = {
        Name    = "${var.project_name}-ec2"
        Project = var.project_name
    }
}
