variable "aws_region" {
    description = "AWS region to deploy StackWatch into"
    type        = string
    default     = "us-west-1"
}

variable "project_name" {
    description = "Project name used for tagging resources"
    type        = string
    default     = "stackwatch"
}

variable "instance_type" {
    description = "EC2 instance type"
    type       = string
    default    = "t3.micro"
}

variable "key_name" {
    description = "Existing AWS EC2 key pair name for SSH access"
    type        = string
}

variable "allowed_ssh_cidr" {
    description = "CIDR block allowed to SSH into the instance"
    type        = string
    default     = "0.0.0.0/0"
}