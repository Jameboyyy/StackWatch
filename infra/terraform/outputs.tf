output "instance_public_ip" {
    description = "Public IP of the StackWatch EC2 instance"
    value       = aws_instance.stackwatch_ec2.public_ip
}

output "instance_public_dns" {
    description = "Public DNS of the StackWatch EC2 instance"
    value       = aws_instance.stackwatch_ec2.public_dns
}

output "instance_id" {
    description = "EC2 instance ID"
    value       = aws_instance.stackwatch_ec2.id
}

output "aws_eip" {
    description = "Elastic IP Address"
    value       = data.aws_eip.existing_eip.public_ip
}
