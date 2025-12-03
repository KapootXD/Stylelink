# Quick Fix: Pipeline Failed Immediately

## Most Common Cause: Workflow Rules

If the pipeline failed "right away" (no jobs created), it's likely the workflow rules.

### Check in GitLab

1. Go to GitLab → **CI/CD** → **Pipelines**
2. Click on the failed pipeline
3. Look at the top of the page for the error message

**Common messages:**
- "Pipeline was skipped" → Workflow rules blocked it
- "No jobs" → No jobs matched the conditions
- "YAML syntax error" → Invalid YAML file

## Quick Fix: Update Workflow Rules

The current workflow rules might be too restrictive. Update them:

```yaml
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH
```

**Change to:**

```yaml
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BANCH == "main"
    - if: $CI_COMMIT_BRANCH  # Allow all branches
```

Or even simpler:

```yaml
workflow:
  rules:
    - when: always  # Always run pipelines
```

## What Error Did You See?

Please check GitLab and tell me:

1. **What status** does it show? (Failed, Skipped, No Jobs, etc.)
2. **What error message** appears at the top?
3. **Did any jobs** get created, or did it fail before creating jobs?

This will help me give you the exact fix!

