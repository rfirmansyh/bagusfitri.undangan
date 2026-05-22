'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import ImgDate2 from '@/public/images/date-2.jpg';
import { Button } from '@/src/components/ui/button';
import { DATA } from '@/src/constant/data.constant';
import { formatDate } from '@/src/lib/utils';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

const ContentDate = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const targetDate = new Date(`${DATA.DATE_HELD}T00:00:00`);
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Calculate immediately on client mount
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return String(num).padStart(2, '0');
  };

  return (
    <section id="content-date" className="w-full bg-[#1B2823] text-[#EEF1F0]!">
      <div className="mx-auto flex max-w-[265px] flex-col items-center gap-y-[24px] py-[48px]">
        <div className="relative h-[269px] w-[181px] overflow-hidden rounded-t-full rounded-b-md bg-[#2C4037] shadow-inner shadow-black">
          <Image loading="lazy" src={ImgDate2} alt="Opening" style={{ objectFit: 'cover' }} />
        </div>

        <div className="flex flex-col items-center gap-[16px] text-center text-white!">
          <h2 className="font-mono text-[32px]">Save The Date</h2>
          <div className="flex items-center justify-center gap-[16px]">
            <div className="text-center">
              <h5 className="text-[16px] font-normal">
                {isMounted ? formatNumber(timeLeft.days) : '00'}
              </h5>
              <span className="text-[12px]">Hari</span>
            </div>
            <div className="text-center">
              <h5 className="text-[16px] font-normal">
                {isMounted ? formatNumber(timeLeft.hours) : '00'}
              </h5>
              <span className="text-[12px]">Jam</span>
            </div>
            <div className="text-center">
              <h5 className="text-[16px] font-normal">
                {isMounted ? formatNumber(timeLeft.minutes) : '00'}
              </h5>
              <span className="text-[12px]">Menit</span>
            </div>
            <div className="text-center">
              <h5 className="text-[16px] font-normal">
                {isMounted ? formatNumber(timeLeft.seconds) : '00'}
              </h5>
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
          <Link href={DATA.PLACE_AKAD_MAPS} target='_blank'>
            <Button size="sm" className="flex items-center gap-1">
              <MapPin size={12} />
              <div>Buka Alamat</div>
            </Button>
          </Link>
        </div>

        <div className="h-[20px] w-px rounded-md bg-white"></div>

        <div className="flex flex-col items-center gap-[12px] text-center text-white!">
          <h2 className="font-mono text-[24px]">Ramah Tamah</h2>
          <div className="mx-auto text-[12px]">
            {DATA.PLACE_HELD}, {formatDate(DATA.DATE_HELD)} <br />
            {DATA.RECEPTION_TIME}
          </div>
          <p className="text-[10px]">{DATA.PLACE_RECEPTION_DETAIL}</p>
          <Link href={DATA.PLACE_RECEPTION_MAPS} target='_blank'>
            <Button size="sm" className="flex items-center gap-1">
              <MapPin size={12} />
              <div>Buka Alamat</div>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContentDate;
