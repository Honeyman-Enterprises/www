# Production Outputs
output "prod_distribution_id" {
  description = "Production CloudFront distribution ID"
  value       = aws_cloudfront_distribution.prod.id
}

output "prod_domain_name" {
  description = "Production CloudFront domain name"
  value       = aws_cloudfront_distribution.prod.domain_name
}

output "prod_bucket" {
  description = "Production S3 bucket name"
  value       = aws_s3_bucket.site_prod.bucket
}

# Website URL
output "website_url" {
  description = "Production website URL"
  value       = "https://${var.domain_name}"
}
