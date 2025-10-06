import { useState } from 'react';
import { Tooltip, Text } from '@mantine/core';
import { MdContentCopy as IconCopy, MdCheck as IconCheck } from 'react-icons/md';

const TruncatedId = ({ id, length = 8 }) => {
  const [copied, setCopied] = useState(false);
  
  const truncatedId = id.length > length ? `${id.slice(0, length)}...` : id;
  
  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Tooltip 
      label={copied ? 'Copied!' : `Click to copy: ${id}`}
      position="top"
      withArrow
    >
      <Text
        component="span"
        size="sm"
        c="dimmed"
        style={{ 
          cursor: 'pointer',
          fontFamily: 'monospace',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          transition: 'all 0.2s ease'
        }}
        onClick={handleCopy}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
        }}
      >
        {truncatedId}
        {copied ? (
          <IconCheck size={14} style={{ color: '#40c057' }} />
        ) : (
          <IconCopy size={14} style={{ opacity: 0.6 }} />
        )}
      </Text>
    </Tooltip>
  );
};

export default TruncatedId;