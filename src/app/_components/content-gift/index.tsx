import Image from 'next/image';

import ImgGift from '@/public/images/gift.png';
import { Button } from '@/src/components/ui/button';
import { DATA } from '@/src/constant/data.constant';
import { MapPin } from 'lucide-react';

import ButtonCopy from './button-copy';

const ContentGift = () => {
  return (
    <section id="content-gift" className="flex h-full w-full items-center bg-[#2C4037] text-white!">
      <div className="mx-auto flex max-w-[312px] flex-col gap-y-[24px] py-[32px] text-center">
        <h2 className="font-mono text-[24px]">Love Gift</h2>

        <div className="relative h-[191px] w-[312px]">
          <Image fill src={ImgGift} alt="" style={{ objectFit: 'contain' }} />
        </div>

        <p className="mx-auto max-w-[280px] font-sans text-[12px]">
          Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih
          untuk mengiringi langkah baru kami, dapat melalui saluran berikut
        </p>

        <hr className="opacity-30" />

        <div className="flex flex-col items-start gap-[8px]">
          <div className="text-[10px]">Cashless</div>
          <ul className="flex w-full flex-col gap-[16px]">
            {DATA.BANKS.map((bank) => (
              <li key={bank.id} className="flex grow items-start gap-[16px]">
                <div className="relative h-[30px] w-[55px] shrink-0 overflow-hidden rounded-[6px] border border-[#616245]">
                  <Image
                    src={`/brands/bank-${bank.key}.svg`}
                    fill
                    alt="Logo Bank"
                    style={{ objectFit: 'cover', width: '100%' }}
                  />
                </div>
                <div className="grow text-left">
                  <div className="text-[10px] font-medium">
                    {bank.label}: {bank.number}
                  </div>
                  <div className="text-[10px] font-light">a.n. {bank.holderName}</div>
                </div>
                <ButtonCopy value={bank.number} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start gap-[8px] text-left">
          <div className="text-[10px]">Atau Kirim Kado Ke:</div>
          <div className="flex items-start gap-2 text-[12px]">
            <MapPin size={12} className="shrink-0" />
            <span className="leading-none">{DATA.PLACE_GIFT}</span>
          </div>
          <ButtonCopy value={DATA.PLACE_GIFT} />
        </div>
      </div>
    </section>
  );
};

export default ContentGift;
