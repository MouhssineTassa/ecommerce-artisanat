import React from 'react';

const Badge = ({ children, color = 'bg-green-200', textColor = 'text-green-800', icon: Icon }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color} ${textColor}`}>
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </span>
);

export default Badge;