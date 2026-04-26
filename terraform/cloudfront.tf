# Simple CORS Headers Policy
data "aws_cloudfront_response_headers_policy" "simple_cors" {
  name = "Managed-SimpleCORS"
}

# CloudFront Origin Access Control (OAC)
resource "aws_cloudfront_origin_access_control" "oac_prod" {
  name                              = "${var.domain_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Production CloudFront Distribution
resource "aws_cloudfront_distribution" "prod" {
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  price_class         = "PriceClass_100"
  comment             = "prod ${var.domain_name}"
  aliases             = [var.domain_name]
  default_root_object = "index.html"

  origin {
    domain_name              = aws_s3_bucket.site_prod.bucket_regional_domain_name
    origin_id                = "s3-${var.domain_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac_prod.id
  }

  default_cache_behavior {
    target_origin_id           = "s3-${var.domain_name}"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.simple_cors.id
    compress                   = true
    min_ttl                    = 0
    default_ttl                = 3600
    max_ttl                    = 86400

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Custom error responses for SPA routing
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 500
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 503
    response_code      = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.website.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  depends_on = [aws_acm_certificate_validation.website]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = local.tags
}

