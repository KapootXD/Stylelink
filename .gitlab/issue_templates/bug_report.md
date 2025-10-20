---
name: Bug Report
about: Create a report to help us improve StyleLink
title: '[BUG] Brief description of the issue'
labels: bug, needs-triage
assignees: ''
---

## Bug Report

**Bug ID**: BUG-XXX (Assigned by maintainer)
**Date Reported**: [Date]
**Reported By**: [Tester/User Name]
**Priority**: [High/Medium/Low]
**Severity**: [Critical/Major/Minor/Cosmetic]

---

### 🐛 Bug Description

**Brief Summary**: 
[Provide a clear, concise description of the bug]

**Detailed Description**:
[Provide a more detailed explanation of what the bug is, including any relevant context]

---

### 🎯 Expected vs Actual Results

**Expected Result**: 
[Describe what should happen when the feature works correctly]

**Actual Result**: 
[Describe what actually happens when the bug occurs]

---

### 🔄 Steps to Reproduce

Please provide detailed steps to reproduce the issue:

1. [First step]
2. [Second step]
3. [Third step]
4. [...continue as needed]

**Additional Notes**: 
[Any special conditions or requirements to reproduce the issue]

---

### 🌐 Environment Information

**Browser**: [e.g., Chrome 119, Firefox 118, Safari 17, Edge 118]
**Operating System**: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
**Device Type**: [Desktop/Mobile/Tablet]
**Screen Resolution**: [e.g., 1920x1080, 375x667 for mobile]
**Viewport Size**: [e.g., Desktop 1200px, Mobile 375px]

**Application Version**: [Version number if available]
**URL**: [The URL where the issue occurred]

---

### 📸 Screenshots

<!-- Please add screenshots if they help explain the problem -->

**Screenshot 1**: [Description of screenshot - e.g., "Homepage showing broken layout"]
![Screenshot 1](link-to-screenshot-1.png)

**Screenshot 2**: [Description - e.g., "Error message in console"]
![Screenshot 2](link-to-screenshot-2.png)

**Screenshot 3**: [Description - e.g., "Expected behavior for comparison"]
![Screenshot 3](link-to-screenshot-3.png)

---

### 🔍 Additional Information

**Console Errors**: 
```
[Paste any JavaScript console errors here]
```

**Network Issues**: 
[Describe any network-related problems, failed requests, etc.]

**Frequency**: 
- [ ] Always occurs
- [ ] Sometimes occurs
- [ ] Rarely occurs
- [ ] First time seeing this

**User Impact**: 
- [ ] Blocks core functionality
- [ ] Affects user experience but workaround exists
- [ ] Minor visual issue
- [ ] No user impact detected

---

### 🔗 Related Issues

**Related Issues**: 
[Link to any related bug reports or feature requests]

**Affected Features**:
- [ ] Homepage
- [ ] Navigation
- [ ] Main Feature Pages
- [ ] Results Page
- [ ] About Page
- [ ] Profile Page
- [ ] Mobile Navigation
- [ ] Responsive Design
- [ ] Animations/Transitions
- [ ] Other: [Specify]

---

### 🧪 Testing Notes

**Test Case Reference**: 
[Reference the specific test case from TESTING.md that discovered this issue, e.g., "Test Case 1.2"]

**Reproducibility Test Results**:
- [ ] Reproduced by reporter
- [ ] Reproduced by development team
- [ ] Cannot reproduce (additional investigation needed)

**Workaround Available**: 
[Describe any temporary workarounds users can employ]

---

### 📋 Issue Resolution

**Status**: 
- [ ] New
- [ ] In Progress
- [ ] Under Review
- [ ] Resolved
- [ ] Closed

**Resolution Notes**: 
[To be filled by development team]

**Fix Verified By**: 
[QA/Testing Team Member]

**Resolution Date**: 
[Date when fix was deployed]

---

## Bug Report Template Instructions

### How to Use This Template

1. **Title**: Start with `[BUG]` followed by a brief description
2. **Labels**: The template automatically adds `bug` and `needs-triage` labels
3. **Priority**: Choose based on impact
   - **High**: Blocks core functionality or critical user flows
   - **Medium**: Affects user experience but workaround exists
   - **Low**: Minor issues or cosmetic problems

4. **Severity**: Choose based on impact level
   - **Critical**: Application crash, data loss, security issue
   - **Major**: Significant functionality broken
   - **Minor**: Small functionality issues
   - **Cosmetic**: Visual/UI issues that don't affect functionality

### Screenshot Guidelines

- Use clear, high-resolution screenshots
- Include both the problematic state and expected state when possible
- Highlight the issue with arrows or circles if necessary
- For responsive issues, include screenshots on different screen sizes

### Environment Reporting

Be as specific as possible about the testing environment:
- Browser version (not just "Chrome" - specify version number)
- Operating system and version
- Device specifics for mobile testing

### Steps to Reproduce

- Number each step clearly
- Be specific about what to click, type, or navigate to
- Include any preconditions (user logged in, specific page state, etc.)
- Test the steps yourself before submitting

### Testing Integration

This template integrates with the StyleLink testing processes:
- References test cases from `TESTING.md`
- Links to manual testing script in `scripts/test-checklist.md`
- Follows established testing protocols

---

### For Development Team

**Review Checklist**:
- [ ] All required information provided
- [ ] Steps to reproduce are clear and accurate
- [ ] Environment details are complete
- [ ] Screenshots attached (if applicable)
- [ ] Priority and severity assigned appropriately
- [ ] Issue labeled correctly

**First Response**: Please acknowledge receipt within 24 hours and provide initial assessment of priority and timeline for resolution.
