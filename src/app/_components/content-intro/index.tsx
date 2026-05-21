import { DATA } from '@/src/constant/data.constant';
import { formatDate } from '@/src/lib/utils';

import ImgIntro from './img-intro';

const ContentIntro = () => {
  return (
    <section id="content-intro" className="h-full w-full bg-[#2C4037] text-white!">
      <div className="mx-auto flex max-w-[312px] flex-col gap-y-[16px] py-[32px]">
        <h2 className="font-mono text-[24px]">{DATA.COUPLE_NAME}</h2>
        <p className="font-sans text-[12px] font-light!">
          اِنَّ الَّذِيْنَ اٰمَنُوْا وَعَمِلُوا الصّٰلِحٰتِ سَيَجْعَلُ لَهُمُ الرَّحْمٰنُ وُدًّا{' '}
          <br />
          Innal-ladzīna āmanū wa 'amiluṣ-ṣāliḥāti sayaj'alu lahumur-raḥmānu wuddā(n).
        </p>

        <p className="font-sans text-[12px] font-light!">
          “Sesungguhnya orang-orang yang beriman dan mengerjakan kebajikan, kelak (Allah) Yang Maha
          Pengasih akan menanamkan rasa kasih sayang (dalam hati mereka)."
          <br />
          (Surat Maryam ayat 96)
        </p>

        <ImgIntro />

        <p className="font-sans text-[12px] font-light!">
          {DATA.PLACE_HELD}, {formatDate(DATA.DATE_HELD)}
        </p>
      </div>
    </section>
  );
};

export default ContentIntro;
