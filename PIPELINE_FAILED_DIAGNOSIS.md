# Pipeline Failed Immediately - Diagnosis Guide

## Common Reasons for Immediate Pipeline Failures

When a pipeline fails "right away" (before any jobs run), it's usually one of these issues:

### 1. **YAML Syntax Error in `.gitlab-ci.yml`**

Invalid YAML syntax will prevent the pipeline from starting.

**Check:**
- Go to GitLab → **CI/CD** → **Pipelines**
- Click on the failed pipeline
- Look for YAML validation errors at the top

**Fix:** Check for:
- Missing colons `:`
- Incorrect indentation
- Invalid YAML structure

### 2. **Workflow Rules Blocking Pipeline**

The workflow rules might be preventing the pipeline from running.

**Check your `.gitlab-ci.yml`:**
```yaml
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH
```

This should allow MR pipelines, but verify:
- Is the branch name correct?
- Is it actually a merge request?

### 3. **Missing Required Files**

The pipeline might need files that don't exist:
- `package.json` (should exist)
- `.gitlab-ci.yml` (should exist)

### 4. **Invalid Job Configuration**

Jobs with invalid configurations won't start.

**Common issues:**
- Invalid `needs:` dependencies (job doesn't exist)
- Conflicting `dependencies:` and `needs:`
- Invalid image names

## How to Diagnose

### Step 1: Check Pipeline Status in GitLab

1. Go to GitLab → **CI/CD** → **Pipelines**
2. Click on the failed pipeline
3. Look at the error message

**Look for:**
- ❌ "Pipeline failed to start" - Usually YAML error
- ❌ "No jobs" - Workflow rules issue
- ❌ "Job failed" - Actual job error (different issue)

### Step 2: Check YAML Syntax Locally

Validate your `.gitlab-ci.yml`:

```bash
# On Windows PowerShell
# Install yamllint first: pip install yamllint
yamllint .gitlab-ci.yml

# Or use online YAML validator
# https://www.yamllint.com/
```

### Step 3: Check Pipeline Logs

In GitLab, the pipeline page will show:
- **Why it failed**
- **Which jobs were created** (or if none were created)
- **Error messages**

## Quick Fixes

### Fix 1: Validate YAML Online

1. Copy contents of `.gitlab-ci.yml`
2. Go to https://www.yamllint.com/
3. Paste and validate
4. Fix any syntax errors

### Fix 2: Check Workflow Rules

If no jobs were created, the workflow rules might be blocking it.

**Temporary fix:** Add a catch-all rule:
```yaml
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH
    - when: always  # Fallback
```

### Fix 3: Simplify to Test

Create a minimal pipeline to test:

```yaml
stages:
  - test

test_job:
  stage: test
  image: node:18
  script:
    - echo "Pipeline is working!"
```

If this works, gradually add complexity back.

## What to Look For in GitLab

When you open the failed pipeline in GitLab:

### Status: "Failed" or "Canceled"
- Check the error message
- Look at which stage failed

### Status: "Skipped"
- Workflow rules are blocking it
- Check branch name and MR status

### Status: "No jobs"
- Workflow rules prevented any jobs from running
- Need to fix workflow rules

### Status: Shows jobs but they all fail immediately
- Check job logs for specific errors
- Usually dependency or configuration issues

## Most Likely Issues for Your Case

Based on your configuration, check:

1. **YAML syntax** - Run a validator
2. **Workflow rules** - Make sure MR pipelines are allowed
3. **Missing variables** - Some jobs might need variables (but shouldn't fail immediately)

## Next Steps

1. **Check the pipeline error message** in GitLab
2. **Share the exact error** you see
3. **I can help fix** based on the specific error

The error message will tell us exactly what's wrong!

