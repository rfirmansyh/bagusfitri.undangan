import Image from 'next/image';

import ImgClosing from '@/public/images/closing.jpg';
import { DATA } from '@/src/constant/data.constant';

const ContentClosing = () => {
  return (
    <section id="content-closing" className="relative h-full w-full text-[#EEF1F0]!">
      <div className="relative h-full w-full overflow-hidden text-[#EEF1F0]!">
        <Image
          fill
          src={ImgClosing}
          alt="Closing"
          className="absolute inset-0 h-full w-full object-cover!"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="absolute bottom-0 flex h-[35%] w-full justify-center bg-linear-to-t from-[#18231e] from-10% to-[#2c4037]/0 to-9%">
        <div className="mx-auto max-w-[312px] text-center">
          <h2 className="mt-[10px] mb-[16px] font-mono text-[32px]">{DATA.COUPLE_NAME}</h2>
          <p className="mb-[32px] text-[10px]">
            Merupakan sebuah kehormatan dan kebahagiaan bagi kami jika Bapak/Ibu /Saudara/i berkenan
            hadir dan memberikan doa restu bagi kami. <br />
            Terima kasih.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContentClosing;
