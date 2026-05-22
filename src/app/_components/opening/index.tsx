'use client';

import { Button } from '@/src/components/ui/button';

import DecOpeningLeft from './dec-opening-left';
import DecOpeningRight from './dec-opening-right';
import DecStar from './dec-start';
import ImgOpening from './img-opening';
import TextDate from './text-date';

type ContentOpeningProps = {
  onClick: VoidFunction;
};

const ContentOpening = ({ onClick }: ContentOpeningProps) => {
  return (
    <div id="content-opening">
      <div className="relative flex h-full w-full items-center justify-center bg-[#18231D]">
        <DecStar />
        <DecOpeningLeft />
        <DecOpeningRight />
        <ImgOpening />

        <Button
          id="btn-buka-undangan"
          variant="2F4539"
          size="lg"
          className="absolute bottom-[7%]"
          onClick={onClick}
        >
          Buka Undangan
        </Button>

        <TextDate />
      </div>
    </div>
  );
};

export default ContentOpening;
