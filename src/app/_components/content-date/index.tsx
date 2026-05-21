import Image from 'next/image';

import ImgDate1 from '@/public/images/date-1.jpg';
import ImgDate2 from '@/public/images/date-2.jpg';
import ImgDate3 from '@/public/images/date-3.jpg';
import { Button } from '@/src/components/ui/button';
import { DATA } from '@/src/constant/data.constant';
import { formatDate } from '@/src/lib/utils';
import { MapPin } from 'lucide-react';

const ContentDate = () => {
  return (
    <section id="content-date" className="w-full bg-[#1B2823] text-[#EEF1F0]!">
      <div className="mx-auto flex max-w-[265px] flex-col items-center gap-y-[24px] py-[48px]">
        <div className="relative h-[269px] w-[181px] overflow-hidden rounded-t-full rounded-b-md bg-[#2C4037] shadow-inner shadow-black">
          <Image fill src={ImgDate2} alt="Opening" style={{ objectFit: 'cover' }} />
        </div>

        <div className="flex flex-col items-center gap-[16px] text-center text-white!">
          <h2 className="font-mono text-[32px]">Save The Date</h2>
          <div className="flex items-center justify-center gap-[16px]">
            <div className="text-center">
              <h5 className="text-[16px] font-normal">60</h5>
              <span className="text-[12px]">Hari</span>
            </div>
            <div className="text-center">
              <h5 className="text-[16px] font-normal">09</h5>
              <span className="text-[12px]">Jam</span>
            </div>
            <div className="text-center">
              <h5 className="text-[16px] font-normal">08</h5>
              <span className="text-[12px]">Menit</span>
            </div>
            <div className="text-center">
              <h5 className="text-[16px] font-normal">02</h5>
              <span className="text-[12px]">Detik</span>
            </div>
          </div>
        </div>

        <div className="h-[20px] w-px rounded-md bg-white"></div>

        <div className="flex flex-col items-center gap-[12px] text-center text-white!">
          <h2 className="font-mono text-[24px]">Akad Nikah</h2>
          <div className="mx-auto text-[12px]">
            {DATA.PLACE_HELD}, {formatDate(DATA.DATE_HELD)} <br />
            Pukul {DATA.AKAD_TIME}
          </div>
          <p className="text-[10px]">
            {DATA.PLACE_AKAD_LABEL} <br />
            {DATA.PLACE_AKAD_DETAIL}
          </p>
          <Button size="sm" className="flex items-center gap-1">
            <MapPin size={12} />
            <div>Buka Alamat</div>
          </Button>
        </div>

        <div className="h-[20px] w-px rounded-md bg-white"></div>

        <div className="flex flex-col items-center gap-[12px] text-center text-white!">
          <h2 className="font-mono text-[24px]">Ramah Tamah</h2>
          <div className="mx-auto text-[12px]">
            {DATA.PLACE_HELD}, {formatDate(DATA.DATE_HELD)} <br />
            {DATA.RECEPTION_TIME}
          </div>
          <p className="text-[10px]">{DATA.PLACE_RECEPTION_DETAIL}</p>
          <Button size="sm" className="flex items-center gap-1">
            <MapPin size={12} />
            <div>Buka Alamat</div>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentDate;
