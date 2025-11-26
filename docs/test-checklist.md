# StyleLink Manual Testing Script

## Overview
This document provides step-by-step manual testing instructions for StyleLink. Testers should follow these instructions systematically to ensure all features work correctly before deployment.

## Prerequisites
- [ ] Development server is running (`npm start`)
- [ ] Application is accessible at `http://localhost:3000` (or configured port)
- [ ] Browser developer tools are open for error checking
- [ ] Testing environment has been set up

---

## Test Setup Instructions

### 1. Environment Setup
1. Open your preferred browser (Chrome recommended for initial testing)
2. Open browser Developer Tools (F12)
3. Go to the Console tab to monitor for errors
4. Navigate to the StyleLink application URL
5. Verify no console errors appear on initial load

---

## Section 1: Homepage Testing

### Hero Section (Priority: High)

**Test Case 1.1: Hero Section Display**
1. Navigate to the homepage (`/`)
2. **Expected**: Large title "If you're looking for style, we're worth your while" is visible
3. **Expected**: Subtitle text about StyleLink is readable and properly formatted
4. **Expected**: Two CTA buttons ("Get Started" and "Learn More") are visible and styled correctly
5. **Check**: Gradient background displays properly with brown/gold color scheme
6. **Check**: Decorative animated circles are visible in the background

**Test Case 1.2: Hero Section Buttons**
1. Click the "Get Started" button
2. **Expected**: Button responds to click (hover effect works)
3. Click the "Learn More" button  
4. **Expected**: Button responds to click and hover effect works
5. **Note**: Buttons may not navigate yet (normal for development phase)

**Test Case 1.3: Hero Section Animations**
1. Reload the page
2. **Expected**: Title animates in smoothly from bottom to top
3. **Expected**: Subtitle text animates in with slight delay
4. **Expected**: Buttons animate in at the end
5. **Check**: No animation stuttering or delays

### Features Section (Priority: High)

**Test Case 1.4: Features Section Header**
1. Scroll down to the "Why Choose StyleLink?" section
2. **Expected**: Section title displays correctly
3. **Expected**: Subtitle text is visible below the main title

**Test Case 1.5: Feature Cards Display**
Test each of the 6 feature cards individually:
1. **Card 1**: "Outfit Posts with Shopping Links"
   - **Expected**: Camera icon displays
   - **Expected**: Title and description text are readable
   - **Check**: Hover over card - should have subtle animation/lift effect

2. **Card 2**: "AI-Powered Recommendations"
   - **Expected**: Sparkles icon displays
   - **Expected**: Content is legible

3. **Card 3**: "Community Discovery"
   - **Expected**: Users icon displays
   - **Expected**: Content is legible

4. **Card 4**: "Monetization for Users"
   - **Expected**: DollarSign icon displays
   - **Expected**: Content is legible

5. **Card 5**: "Global Fashion Connection"
   - **Expected**: Globe icon displays
   - **Expected**: Content is legible

6. **Card 6**: "Authentic Style Sharing"
   - **Expected**: Heart icon displays
   - **Expected**: Content is legible

**Test Case 1.6: Feature Cards Interaction**
1. Hover over each feature card
2. **Expected**: Each card has a subtle hover animation (scale, shadow change)
3. Click on each card (if clickable)
4. **Check**: No JavaScript errors in console during interactions

### How It Works Section (Priority: Medium)

**Test Case 1.7: Steps Section**
1. Scroll to the "How It Works" section (white background)
2. **Expected**: Section title and subtitle display correctly
3. **Check**: Three step cards are visible horizontally (on desktop)

**Test Case 1.8: Individual Steps**
Test each step card:
1. **Step 1**: "Upload Your Look"
   - **Expected**: Number "01" badge displays at the top
   - **Expected**: Upload icon in gradient circle
   - **Expected**: Title and description text

2. **Step 2**: "Discover & Connect"
   - **Expected**: Number "02" badge
   - **Expected**: Search icon in circle
   - **Expected**: Content is readable

3. **Step 3**: "Share & Earn"
   - **Expected**: Number "03" badge
   - **Expected**: Share2 icon in circle
   - **Expected**: Content is readable

**Test Case 1.9: Connection Lines (Desktop Only)**
1. **On Desktop**: Check that connecting lines appear between steps
2. **Expected**: Gradient lines connect the step circles (if viewport is wide enough)

### Final CTA Section (Priority: Medium)

**Test Case 1.10: Final Call-to-Action**
1. Scroll to the final section with gradient background
2. **Expected**: "Ready to Transform Your Style Journey?" title displays
3. **Expected**: Descriptive text is readable
4. **Expected**: Two buttons are visible: "Start Your Style Journey" and "Explore Features"
5. **Test**: Hover effects work on both buttons

---

## Section 2: Navigation Testing

### Desktop Navigation (Priority: High)

**Test Case 2.1: Logo and Branding**
1. **Expected**: "StyleLink" logo/text is visible in the top-left
2. Click on the logo
3. **Expected**: Navigation to home page (current page should reload/refresh)
4. **Check**: URL shows root path (`/`)

**Test Case 2.2: Main Navigation Links**
Test each navigation item:
1. **Home Link**: Click "Home"
   - **Expected**: Navigate to homepage
   - **Expected**: URL shows `/`
   - **Expected**: "Home" link shows active state (highlighted/colored)

2. **Discover Link**: Click "Discover"
   - **Expected**: Navigate to `/discover`
   - **Expected**: Page loads with "Discover" title
   - **Expected**: "Discover" link shows active state

3. **Results Link**: Click "Results"
   - **Expected**: Navigate to `/results`
   - **Expected**: Page displays "ResultsPage"
   - **Expected**: "Results" link shows active state

4. **About Link**: Click "About"
   - **Expected**: Navigate to `/about`
   - **Expected**: Page displays "AboutPage"
   - **Expected**: "About" link shows active state

**Test Case 2.3: Right Side Navigation**
1. **Search Icon**: Click the search icon (magnifying glass)
   - **Check**: No JavaScript errors
   - **Note**: Search functionality may not be implemented yet

2. **Heart Icon**: Click the heart icon
   - **Check**: No JavaScript errors
   - **Note**: Heart/favorites functionality may not be implemented yet

3. **Profile Link**: Click "Profile" (with user icon)
   - **Expected**: Navigate to `/profile`
   - **Expected**: Page displays "ProfilePage"
   - **Expected**: "Profile" link shows active state

**Test Case 2.4: Navigation Hover States**
1. Hover over each navigation link
2. **Expected**: Each link shows hover state (color change, background highlight)
3. **Expected**: Smooth transitions (no flickering)

### Mobile Navigation (Priority: High)

**Test Case 2.5: Mobile Menu Toggle**
1. Resize browser window to mobile size (or use mobile device)
2. **Expected**: Hamburger menu icon (three lines) appears on the right
3. **Expected**: Desktop navigation links are hidden
4. Click the hamburger menu
5. **Expected**: Menu opens, showing all navigation links
6. **Expected**: Hamburger icon changes to "X" (close icon)

**Test Case 2.6: Mobile Menu Navigation**
1. With mobile menu open, test each link:
   - **Home**: Should navigate to homepage and close menu
   - **Discover**: Should navigate and close menu
   - **Results**: Should navigate and close menu
   - **About**: Should navigate and close menu
   - **Profile**: Should navigate and close menu

2. **Check**: Menu closes automatically after each navigation
3. **Check**: No JavaScript errors during navigation

**Test Case 2.7: Mobile Menu Closing**
1. Open mobile menu
2. Click the "X" button
3. **Expected**: Menu closes smoothly
4. **Expected**: Hamburger icon reverts to original state

---

## Section 3: Page-Specific Testing

### Dynamic Route Testing (Priority: High)

**Test Case 3.1: Main Feature Routes**
Test various dynamic routes:
1. Navigate to `/discover`
   - **Expected**: Page loads with title "Discover"
   - **Expected**: URL shows `/discover`
   - **Expected**: Page has consistent styling

2. Navigate to `/streetwear`
   - **Expected**: Page loads with title "Streetwear"
   - **Expected**: URL shows `/streetwear`

3. Navigate to `/vintage`
   - **Expected**: Page loads with title "Vintage"
   - **Expected**: URL shows `/vintage`

**Test Case 3.2: Route Precedence**
1. Navigate to `/results`
   - **Expected**: Shows ResultsPage, NOT MainFeaturePage
   - **Expected**: Title shows "ResultsPage"

2. Navigate to `/about`
   - **Expected**: Shows AboutPage, NOT MainFeaturePage
   - **Expected**: Title shows "AboutPage"

3. Navigate to `/profile`
   - **Expected**: Shows ProfilePage, NOT MainFeaturePage
   - **Expected**: Title shows "ProfilePage"

### Static Pages Testing (Priority: Medium)

**Test Case 3.3: Results Page**
1. Navigate to `/results`
2. **Expected**: Page loads without errors
3. **Expected**: "ResultsPage" title displays
4. **Expected**: "Search results and fashion discoveries" subtitle

**Test Case 3.4: About Page**
1. Navigate to `/about`
2. **Expected**: Page loads without errors
3. **Expected**: "AboutPage" title displays
4. **Expected**: "Learn more about StyleLink and our mission" subtitle

**Test Case 3.5: Profile Page**
1. Navigate to `/profile`
2. **Expected**: Page loads without errors
3. **Expected**: "ProfilePage" title displays
4. **Expected**: "Your StyleLink profile and preferences" subtitle

### 404 Page Testing (Priority: Medium)

**Test Case 3.6: Invalid Routes**
1. Navigate to `/invalid-page-123`
2. **Expected**: 404 page displays (NotFoundPage)
3. **Expected**: No errors in console
4. **Expected**: Navigation still works from 404 page

---

## Section 4: Responsive Design Testing

### Breakpoint Testing

**Test Case 4.1: Mobile View (320px - 768px)**
1. Resize browser to mobile width (375px)
2. **Homepage Checks**:
   - Hero title wraps appropriately
   - CTA buttons stack or remain accessible
   - Feature cards display in single column
   - "How It Works" steps stack vertically
3. **Navigation Checks**:
   - Hamburger menu appears
   - All navigation accessible through menu
4. **General Checks**:
   - No horizontal scrolling
   - Text remains readable
   - Touch targets are appropriately sized

**Test Case 4.2: Tablet View (768px - 1024px)**
1. Resize browser to tablet width (768px)
2. **Expected**: Feature cards display in 2-column grid
3. **Expected**: "How It Works" may show 3-column or adapt as needed
4. **Expected**: Navigation remains horizontal

**Test Case 4.3: Desktop View (1024px+)**
1. Resize browser to desktop width (1200px+)
2. **Expected**: Full 3-column feature grid
3. **Expected**: "How It Works" connection lines visible
4. **Expected**: All animations and hover effects work

### Device Rotation Testing (Mobile/Tablet)

**Test Case 4.4: Orientation Changes**
1. On mobile device or responsive mode, rotate orientation
2. **Expected**: Layout adapts smoothly
3. **Expected**: No content is cut off or inaccessible
4. **Expected**: Navigation remains functional

---

## Section 5: Browser Compatibility Testing

### Core Browser Testing

**Test Case 5.1: Chrome Testing**
1. Open StyleLink in Chrome (latest version)
2. Run through key test cases:
   - Homepage loads correctly
   - Navigation works
   - Animations are smooth
3. **Check**: No console errors
4. **Check**: All CSS renders properly

**Test Case 5.2: Firefox Testing**
1. Open StyleLink in Firefox (latest version)
2. **Check**: Gradient backgrounds render
3. **Check**: CSS Grid layouts work
4. **Check**: Icons display correctly

**Test Case 5.3: Safari Testing**
1. Open StyleLink in Safari (latest version)
2. **Check**: Animations perform well
3. **Check**: Navigation functions correctly
4. **Check**: No rendering issues

**Test Case 5.4: Edge Testing**
1. Open StyleLink in Edge (latest version)
2. **Check**: React Router navigation works
3. **Check**: All interactive elements function
4. **Check**: No JavaScript errors

---

## Section 6: Performance and Error Testing

### Performance Checks (Priority: Medium)

**Test Case 6.1: Page Load Performance**
1. Open browser DevTools
2. Go to Network tab
3. Reload the homepage
4. **Check**: Page loads within reasonable time (under 3 seconds)
5. **Check**: No large resource files blocking page load

**Test Case 6.2: Animation Performance**
1. Navigate through pages with animations
2. **Check**: Animations are smooth (60fps)
3. **Check**: No stuttering or lag during transitions

### Error Testing (Priority: High)

**Test Case 6.3: Console Error Check**
1. Keep browser DevTools open to Console tab
2. Navigate through all pages and features
3. **Expected**: No JavaScript errors or warnings
4. **Expected**: No React errors or warnings
5. **Note**: Report any errors found immediately

**Test Case 6.4: Navigation Error Recovery**
1. Try navigating to various URLs (valid and invalid)
2. **Expected**: Valid URLs load correctly
3. **Expected**: Invalid URLs show 404 page gracefully
4. **Expected**: Browser back/forward buttons work

---

## Test Completion Checklist

### Final Verification
Before marking testing complete, verify:

- [ ] All critical test cases (Priority: High) have been completed
- [ ] No critical bugs or errors found
- [ ] All navigation paths work correctly
- [ ] Responsive design works on target devices
- [ ] No console errors during normal usage
- [ ] All major browser compatibility issues addressed

### Bug Reporting
If issues are found during testing:
1. Document the issue using the bug report template
2. Include screenshots if visual issues
3. Note the browser and device used
4. Provide steps to reproduce the issue
5. Assign appropriate severity level

### Testing Sign-off
- [ ] Primary tester signature/name: _________________
- [ ] Date completed: _________________
- [ ] Browser(s) tested: _________________
- [ ] Device(s) tested: _________________
- [ ] Overall status: Pass / Fail / Conditional Pass

---

## Notes for Testers

### Common Issues to Watch For
- Animation performance on slower devices
- Mobile menu not closing after navigation
- Console errors during page transitions
- Responsive breakpoints not triggering correctly
- Icon rendering issues in certain browsers

### Testing Tips
1. Use browser DevTools responsive mode for mobile testing
2. Keep console tab open throughout testing
3. Test both clicking and keyboard navigation where applicable
4. Take notes on any unexpected behavior, even if not errors
5. Test with different internet connection speeds if possible

### When to Escalate Issues
- Any JavaScript errors or crashes
- Navigation not working properly
- Major visual layout problems
- Performance issues that affect usability
- Browser compatibility problems with supported browsers
