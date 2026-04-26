# Honeyman Enterprises - AWS Infrastructure

Terraform configuration for deploying the Honeyman Enterprises React SPA to AWS using S3, CloudFront, and Route53.

## Architecture

- **S3 Buckets**: Private buckets for production and staging
- **CloudFront**: CDN distributions with HTTPS, HTTP/3, and IPv6
- **ACM Certificate**: SSL/TLS certificate (must exist in us-east-1)
- **Route53**: DNS records for apex, www, and staging
- **OAC (Origin Access Control)**: Secure access from CloudFront to S3

## Security Features

- ✅ S3 buckets completely private (no public access)
- ✅ CloudFront Origin Access Control (OAC) with SigV4 signing
- ✅ HTTPS enforced (HTTP redirects to HTTPS)
- ✅ TLS 1.2+ minimum
- ✅ Server-side encryption (AES256)
- ✅ Versioning enabled
- ✅ WWW → Apex redirect via CloudFront function
- ✅ Staging IP restriction via CloudFront function

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Terraform** >= 1.7.0 installed
3. **AWS CLI** configured with credentials
4. **ACM Certificate** in us-east-1 covering:
   - honeymanenterprises.com
   - www.honeymanenterprises.com
   - staging.honeymanenterprises.com
5. **Route53 Hosted Zone** for honeymanenterprises.com

## Initial Setup

### 1. Configure Variables

Copy the example variables file:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set:
- `acm_certificate_arn` - Your ACM certificate ARN from us-east-1
- `staging_allow_ip` - Your IP address (get it: `curl -s https://checkip.amazonaws.com`)

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Review Infrastructure Plan

```bash
terraform plan
```

### 4. Apply Infrastructure

```bash
terraform apply
```

**Note**: First deployment creates:
- 2 S3 buckets (prod + staging)
- 2 CloudFront distributions (may take 10-15 minutes)
- 2 CloudFront functions (www redirect + staging IP filter)
- 3 Route53 A records (apex, www, staging)
- Cache policy and OAC resources

## Deployment Workflow

### Build and Deploy to Production

```bash
# 1. Build the React app
cd /path/to/honeyman-react_spa
npm ci
npm run build

# 2. Get bucket name from Terraform
cd terraform
PROD_BUCKET=$(terraform output -raw prod_bucket)

# 3. Sync to S3
aws s3 sync ../dist/ "s3://$PROD_BUCKET" --delete --only-show-errors

# 4. Invalidate CloudFront cache for index.html
PROD_DIST_ID=$(terraform output -raw prod_distribution_id)
aws cloudfront create-invalidation --distribution-id "$PROD_DIST_ID" --paths "/index.html"
```

### Build and Deploy to Staging

```bash
# 1. Build the React app
npm ci
npm run build

# 2. Deploy to staging
cd terraform
STAGING_BUCKET=$(terraform output -raw staging_bucket)
aws s3 sync ../dist/ "s3://$STAGING_BUCKET" --delete --only-show-errors

# 3. Invalidate CloudFront cache
STAGING_DIST_ID=$(terraform output -raw staging_distribution_id)
aws cloudfront create-invalidation --distribution-id "$STAGING_DIST_ID" --paths "/index.html"
```

## File Structure

```
terraform/
├── providers.tf           # Terraform and AWS provider configuration
├── locals.tf             # Local variables and tags
├── variables.tf          # Input variables
├── dns.tf               # Route53 hosted zone data source
├── s3.tf                # S3 buckets (prod + staging) with policies
├── cloudfront.tf        # CloudFront distributions and functions
├── route53_records.tf   # DNS A records
├── outputs.tf           # Output values
├── terraform.tfvars.example  # Example variables file
└── README.md            # This file
```

## Outputs

After `terraform apply`:

```bash
# Production
terraform output prod_bucket              # S3 bucket name
terraform output prod_distribution_id     # CloudFront distribution ID
terraform output prod_url                 # https://honeymanenterprises.com

# Staging
terraform output staging_bucket           # S3 bucket name
terraform output staging_distribution_id  # CloudFront distribution ID
terraform output staging_url              # https://staging.honeymanenterprises.com
```

## Environment Variables (Alternative)

Instead of `terraform.tfvars`, you can use environment variables:

```bash
export TF_VAR_domain_name="honeymanenterprises.com"
export TF_VAR_domain_www="www.honeymanenterprises.com"
export TF_VAR_domain_staging="staging.honeymanenterprises.com"
export TF_VAR_acm_certificate_arn="arn:aws:acm:us-east-1:XXXX:certificate/XXXX"
export TF_VAR_aws_region="us-east-1"
export TF_VAR_staging_allow_ip="$(curl -s https://checkip.amazonaws.com)"

terraform apply
```

## CloudFront Functions

### WWW Redirect Function
Redirects `www.honeymanenterprises.com` → `honeymanenterprises.com` with 301 status.

### Staging IP Allow Function
Restricts staging environment to a single IP address. Returns 403 for unauthorized IPs.

## Cache Configuration

- **Default TTL**: 1 hour (3600s)
- **Max TTL**: 24 hours (86400s)
- **Min TTL**: 0
- **Compression**: Enabled (Gzip + Brotli)
- **Security Headers**: Managed policy applied

## SPA Routing

CloudFront custom error responses handle React Router:
- All 4xx/5xx errors → `/index.html` with 200 status
- React app handles client-side routing

## Troubleshooting

### Certificate Validation Issues

If using a new certificate, ensure DNS validation records exist in Route53. The hosted zone must be authoritative.

### 403 Forbidden Errors

1. Verify S3 bucket policy includes CloudFront distribution ARN
2. Check OAC is properly configured
3. Ensure files exist in S3
4. Wait 10-15 minutes for CloudFront deployment

### Staging Access Blocked

Update `staging_allow_ip` in `terraform.tfvars`:
```bash
staging_allow_ip = "YOUR.NEW.IP.HERE"
```

Then apply:
```bash
terraform apply
```

Wait 1-2 minutes for CloudFront function update.

### SPA Routes Return 404

Verify custom error responses are configured (should return `/index.html` with 200 status).

## Cost Estimate (Monthly)

- **S3 Storage**: ~$1 (2 buckets, low traffic)
- **S3 Requests**: ~$0.50
- **CloudFront**: ~$2-8 (depends on traffic)
- **Route53**: $0.50 (hosted zone)
- **ACM Certificate**: Free
- **Total**: ~$4-10/month for low-medium traffic

## Infrastructure Updates

### Modify Cache Settings

Edit `locals.tf`:
```hcl
cache_default_ttl = 7200  # 2 hours
cache_max_ttl     = 172800 # 48 hours
```

Apply changes:
```bash
terraform apply
```

### Add Allowed IP for Staging

Edit `terraform.tfvars`:
```hcl
staging_allow_ip = "NEW.IP.ADDRESS"
```

Apply:
```bash
terraform apply
```

## Validation Commands

```bash
# Validate Terraform syntax
terraform fmt -recursive
terraform validate

# Check state
terraform state list

# View specific output
terraform output prod_url
```

## Cleanup

To destroy all infrastructure:

```bash
terraform destroy
```

**Warning**: This deletes S3 buckets and all website files. Ensure backups exist.

## Additional Security Recommendations

- Enable CloudFront access logging
- Set up AWS WAF for DDoS protection
- Enable CloudTrail for audit logging
- Configure S3 lifecycle policies for versioning
- Add CloudWatch alarms for monitoring

## Support

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
