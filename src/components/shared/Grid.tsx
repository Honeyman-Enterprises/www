import { forwardRef, Children } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  alternating?: boolean;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 3, gap = 'md', alternating = false, className, children, ...rest }, ref) => {
    const childArray = Children.toArray(children);
    const childCount = childArray.length;

    const colStyles = {
      1: 'tablet:grid-cols-1 desktop:grid-cols-1',
      2: 'tablet:grid-cols-2 desktop:grid-cols-2',
      3: 'tablet:grid-cols-2 desktop:grid-cols-3',
      4: 'tablet:grid-cols-2 desktop:grid-cols-4',
    };

    const gapStyles = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    };

    // If alternating layout is enabled and cols is 2, apply directional classes
    if (alternating && cols === 2) {
      return (
        <div
          ref={ref}
          className={cn('flex flex-col', gapStyles[gap], className)}
          {...rest}
        >
          {childArray.map((child, index) => {
            const isOdd = index % 2 === 0; // 0-indexed, so 0, 2, 4 are "odd sections" (1st, 3rd, 5th)
            return (
              <div
                key={index}
                className={cn(
                  'grid grid-cols-1 tablet:grid-cols-2',
                  gapStyles[gap],
                  isOdd ? '' : 'tablet:[&>*:first-child]:order-2'
                )}
              >
                {child}
              </div>
            );
          })}
        </div>
      );
    }

    // Special handling for 5 cards in a 3-column grid
    // Use flexbox to allow natural centering of incomplete rows
    if (cols === 3 && childCount === 5) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex flex-wrap justify-center',
            gapStyles[gap],
            'mb-8 md:mb-12',
            className
          )}
          {...rest}
        >
          {childArray.map((child, index) => (
            <div
              key={index}
              className="w-full tablet:w-[48%] desktop:w-[31%]"
            >
              {child}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid grid-cols-1',
          colStyles[cols],
          gapStyles[gap],
          'mb-8 md:mb-12',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export default Grid;
