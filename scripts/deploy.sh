#!/bin/bash
# deploy.sh - Automated deployment script for Honeyman Enterprises website
#
# This script:
# 1. Builds the production bundle
# 2. Syncs files to S3
# 3. Invalidates CloudFront cache
# 4. Verifies deployment

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="honeymanenterprises.com"
BUILD_DIR="dist"
TERRAFORM_DIR="terraform"

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
  log_info "Checking prerequisites..."

  if ! command -v aws &> /dev/null; then
    log_error "AWS CLI not found. Please install: https://aws.amazon.com/cli/"
    exit 1
  fi

  if ! command -v terraform &> /dev/null; then
    log_error "Terraform not found. Please install: https://www.terraform.io/downloads"
    exit 1
  fi

  if ! command -v npm &> /dev/null; then
    log_error "npm not found. Please install Node.js: https://nodejs.org/"
    exit 1
  fi

  log_success "All prerequisites found"
}

# Build production bundle
build_production() {
  log_info "Building production bundle..."

  npm run build

  if [ ! -d "$BUILD_DIR" ]; then
    log_error "Build directory not found: $BUILD_DIR"
    exit 1
  fi

  log_success "Production build complete"
}

# Get CloudFront distribution ID from Terraform
get_distribution_id() {
  log_info "Getting CloudFront distribution ID..."

  cd "$TERRAFORM_DIR"
  DIST_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null)
  cd ..

  if [ -z "$DIST_ID" ]; then
    log_error "CloudFront distribution ID not found. Run 'terraform apply' first."
    exit 1
  fi

  log_success "Distribution ID: $DIST_ID"
  echo "$DIST_ID"
}

# Sync files to S3
sync_to_s3() {
  log_info "Syncing files to S3..."

  # Upload non-HTML files with long cache
  log_info "Uploading static assets (JS, CSS, images)..."
  aws s3 sync "$BUILD_DIR/" "s3://$BUCKET_NAME/" \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "*.txt" \
    --exclude "*.xml" \
    --metadata-directive REPLACE

  # Upload HTML files with short cache
  log_info "Uploading HTML files..."
  aws s3 sync "$BUILD_DIR/" "s3://$BUCKET_NAME/" \
    --cache-control "public, max-age=300, must-revalidate" \
    --exclude "*" \
    --include "*.html" \
    --metadata-directive REPLACE

  # Upload robots.txt and sitemap.xml with medium cache
  log_info "Uploading SEO files..."
  aws s3 sync "$BUILD_DIR/" "s3://$BUCKET_NAME/" \
    --cache-control "public, max-age=3600" \
    --exclude "*" \
    --include "robots.txt" \
    --include "sitemap.xml" \
    --metadata-directive REPLACE

  log_success "Files synced to S3"
}

# Invalidate CloudFront cache
invalidate_cloudfront() {
  local dist_id=$1

  log_info "Creating CloudFront invalidation..."

  INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$dist_id" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

  log_success "Invalidation created: $INVALIDATION_ID"

  # Optional: Wait for invalidation to complete
  read -p "Wait for invalidation to complete? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Waiting for invalidation to complete (this may take 5-10 minutes)..."
    aws cloudfront wait invalidation-completed \
      --distribution-id "$dist_id" \
      --id "$INVALIDATION_ID"
    log_success "Invalidation complete!"
  else
    log_info "Invalidation running in background. Check status with:"
    echo "aws cloudfront get-invalidation --distribution-id $dist_id --id $INVALIDATION_ID"
  fi
}

# Verify deployment
verify_deployment() {
  log_info "Verifying deployment..."

  # Check if S3 bucket exists and has files
  FILE_COUNT=$(aws s3 ls "s3://$BUCKET_NAME/" --recursive | wc -l)

  if [ "$FILE_COUNT" -lt 1 ]; then
    log_error "No files found in S3 bucket"
    exit 1
  fi

  log_success "Found $FILE_COUNT files in S3 bucket"

  # Get CloudFront URL
  cd "$TERRAFORM_DIR"
  CF_URL=$(terraform output -raw cloudfront_domain_name 2>/dev/null)
  cd ..

  if [ -n "$CF_URL" ]; then
    log_success "CloudFront URL: https://$CF_URL"
    log_success "Website URL: https://honeymanenterprises.com"
  fi
}

# Main deployment flow
main() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║     Honeyman Enterprises Deployment Script               ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""

  check_prerequisites
  echo ""

  # Confirm deployment
  log_warning "This will deploy to production (S3 bucket: $BUCKET_NAME)"
  read -p "Continue? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Deployment cancelled"
    exit 0
  fi

  echo ""
  build_production
  echo ""

  DIST_ID=$(get_distribution_id)
  echo ""

  sync_to_s3
  echo ""

  invalidate_cloudfront "$DIST_ID"
  echo ""

  verify_deployment
  echo ""

  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║     🎉 Deployment Complete!                               ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  log_info "Website will be available at:"
  log_success "  • https://honeymanenterprises.com"
  log_success "  • https://www.honeymanenterprises.com"
  echo ""
  log_info "Cache invalidation may take 5-10 minutes to fully propagate."
  echo ""
}

# Run main function
main "$@"
