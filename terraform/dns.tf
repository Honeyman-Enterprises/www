# Create Route53 Hosted Zone
resource "aws_route53_zone" "public" {
  name = var.domain_name

  tags = merge(local.tags, {
    Name = "Honeyman Enterprises Hosted Zone"
  })
}
