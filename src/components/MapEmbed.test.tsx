import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MapEmbed from './MapEmbed';

describe('MapEmbed', () => {
  it('クエリをエンコードした src で iframe を表示する', () => {
    render(<MapEmbed query="北海道 キャンプ場" label="テストキャンプ" />);

    const iframe = screen.getByTitle('テストキャンプの地図');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining(encodeURIComponent('北海道 キャンプ場')),
    );
    expect(iframe).toHaveAttribute('src', expect.stringContaining('maps.google.com'));
  });

  it('aria-label にキャンプ場名が含まれる', () => {
    render(<MapEmbed query="北海道 キャンプ場" label="テストキャンプ" />);

    expect(screen.getByLabelText('テストキャンプの地図')).toBeInTheDocument();
  });

  it('"Google マップで開く" リンクが正しい href と target="_blank" を持つ', () => {
    render(<MapEmbed query="北海道 キャンプ場" label="テストキャンプ" />);

    const link = screen.getByRole('link', { name: /Google マップで開く/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(encodeURIComponent('北海道 キャンプ場')),
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
