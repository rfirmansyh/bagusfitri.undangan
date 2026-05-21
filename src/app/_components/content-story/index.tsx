import Image from 'next/image';

import ImgStory from '@/public/images/story.jpg';

import DecStory from './dec-story';

const ContentStory = () => {
  return (
    <section
      id="content-story"
      className="relative h-full w-full bg-[#2C4037] text-center text-white!"
    >
      <Image
        fill
        src={ImgStory}
        alt="Story"
        className="absolute inset-0 h-full w-full object-cover!"
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-[#18231e] from-10% to-[#2c4037]/10">
        <div className="relative mx-auto flex w-full max-w-[312px] flex-col items-center justify-center gap-y-[32px] bg-[#000000]/50 px-[24px] py-[48px]">
          <div className="flex flex-col items-center gap-y-[8px]">
            <h3 className="text-[14px] font-semibold">Awal Pertemuan</h3>
            <div className="text-[12px] font-medium">Jember, Desember 2022</div>
            <p className="text-[12px] font-light">
              Awal mula kami dipertemukan dalam sebuah project ilustrasi poster. Berawal dari
              bertukar ide dan bekerja bersama, tanpa disadari tumbuh sebuah cerita yang akhirnya
              membawa kami pada perjalanan ini.
            </p>
          </div>

          <div className="flex flex-col items-center gap-y-[8px]">
            <h3 className="text-[14px] font-semibold">Berkomitmen</h3>
            <div className="text-[12px] font-medium">Jember, 14 Februari 2023</div>
            <p className="text-[12px] font-light">
              Setelah sering mengerjakan project dan berkarya bersama, seiring berjalannya waktu
              kebersamaan itu membawa kami semakin dekat. Dari setiap proses yang kami lalui,
              akhirnya kami memutuskan untuk menjalin sebuah komitmen dan melangkah bersama.
            </p>
          </div>
        </div>
      </div>

      <DecStory />
    </section>
  );
};

export default ContentStory;
