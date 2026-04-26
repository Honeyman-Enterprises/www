# Route53 Records for Production (Apex and WWW)
resource "aws_route53_record" "apex_a" {
  zone_id = aws_route53_zone.public.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.prod.domain_name
    zone_id                = aws_cloudfront_distribution.prod.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_cname" {
  zone_id = aws_route53_zone.public.zone_id
  name    = var.domain_www
  type    = "CNAME"
  ttl     = 300
  records = [var.domain_name]
}

