# Production S3 Bucket
resource "aws_s3_bucket" "site_prod" {
  bucket = var.bucket_name
  tags   = local.tags
}

resource "aws_s3_bucket_versioning" "prod" {
  bucket = aws_s3_bucket.site_prod.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "prod" {
  bucket = aws_s3_bucket.site_prod.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "prod" {
  bucket                  = aws_s3_bucket.site_prod.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "prod" {
  bucket = aws_s3_bucket.site_prod.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "prod" {
  bucket     = aws_s3_bucket.site_prod.id
  acl        = "private"
  depends_on = [aws_s3_bucket_ownership_controls.prod]
}

# S3 Bucket Policy (Strict OAC)
data "aws_iam_policy_document" "prod_oac" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site_prod.arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.prod.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "prod" {
  bucket     = aws_s3_bucket.site_prod.id
  policy     = data.aws_iam_policy_document.prod_oac.json
  depends_on = [aws_cloudfront_distribution.prod]
}
