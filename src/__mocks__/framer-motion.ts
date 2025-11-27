import React from 'react';

// Mock framer-motion for testing - using React.createElement to avoid JSX parsing issues
const createMockComponent = (tag: string) => {
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement(tag, Object.assign({}, props, { ref }), props.children);
  });
};

export const motion = {
  div: createMockComponent('div'),
  button: createMockComponent('button'),
  input: createMockComponent('input'),
  label: createMockComponent('label'),
  p: createMockComponent('p'),
  circle: createMockComponent('circle'),
  svg: createMockComponent('svg'),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};

export const useReducedMotion = () => false;

