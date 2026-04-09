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
                apt update -y
                apt install -y docker.io
                systemctl start docker
                systemctl enable docker
                usermod -aG docker ubuntu
                EOF

    tags = {
        Name    = "${var.project_name}-ec2"
        Project = var.project_name
    }
}
