'use client';

import { Button } from '@/src/components/ui/button';

import DecOpeningLeft from './dec-opening-left';
import DecOpeningRight from './dec-opening-right';
import DecStar from './dec-start';
import ImgOpening from './img-opening';
import TextDate from './text-date';

type ContentOpeningProps = {
  guestName?: string;
  onClick: VoidFunction;
};

const ContentOpening = ({ guestName = 'Tamu Undangan', onClick }: ContentOpeningProps) => {
  return (
    <div id="content-opening">
      <div className="relative flex flex-col h-full w-full items-center justify-center bg-[#18231D]">
        <DecStar />
        <DecOpeningLeft />
        <DecOpeningRight />

        <ImgOpening />
        <div className="flex flex-col items-center text-center gap-[6px] text-[14px] text-white mt-[32px] mb-[24px]">
          <div className="text-[12px]">Kepada Yth. Bapak/Ibu/Saudara/i</div>
          <div className="font-semibold">{guestName}</div>
        </div>

        <Button
          id="btn-buka-undangan"
          variant="2F4539"
          size="lg"
          className="bottom-[7%]"
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
