resource "aws_key_pair" "notiboard_key" {
  key_name   = "notiboard-key"
  public_key = file("notiboard-key.pub")

}

resource "aws_security_group" "notiboard_sg" {
  name        = "notiboard-sg"
  description = "Allow HTTP and Flask"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Flask API"
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_instance" "notiboard_backend" {
  ami                         = "ami-024e6efaf93d85776" # Ubuntu 22.04 (for us-east-2)
  instance_type               = "t3.micro"
  key_name                    = aws_key_pair.notiboard_key.key_name
  vpc_security_group_ids      = [aws_security_group.notiboard_sg.id]

  tags = {
    Name = "NotiBoard-Backend"
  }

  user_data = file("startup.sh")
}
