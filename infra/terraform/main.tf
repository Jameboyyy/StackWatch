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
        from_port   = 80
        to_port     = 80
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

data "aws_eip" "existing_eip" {
    public_ip = "184.169.244.68"
}

resource "aws_eip_association" "eip_assoc" {
    instance_id     = aws_instance.stackwatch_ec2.id
    allocation_id   = data.aws_eip.existing_eip.id
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

                exec > /var/log/user-data.log 2>&1

                apt update -y
                apt install -y docker.io docker-compose-v2 curl

                systemctl start docker
                systemctl enable docker

                usermod -aG docker ubuntu

                mkdir -p /home/ubuntu/StackWatch
                cd /home/ubuntu/StackWatch

                cat > docker-compose.yml <<COMPOSEEOF
                services:
                    backend:
                        image: ghcr.io/jameboyyy/stackwatch-backend:latest
                        container_name: stackwatch-backend
                        ports:
                            - "3000:3000"
                        environment:
                            - PORT=3000
                        restart: unless-stopped

                    frontend:
                        image: ghcr.io/jameboyyy/stackwatch-frontend:latest
                        container_name: stackwatch-frontend
                        ports:
                            - "80:80"
                        depends_on:
                            - backend
                        restart: unless-stopped
                COMPOSEEOF

                docker compose pull
                docker compose up -d
                EOF

    tags = {
        Name    = "${var.project_name}-ec2"
        Project = var.project_name
    }
}
