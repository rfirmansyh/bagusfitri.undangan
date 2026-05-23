import React, { SubmitEventHandler } from 'react';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

import ImgPray from './img-pray';

type ContentPrayProps = {
  form: UseFormReturn<any>;
  submitHandler: (data: any) => void;
  onClickSee: VoidFunction;
};

const ContentPray = ({ form, submitHandler, onClickSee }: ContentPrayProps) => {
  return (
    <section
      id="content-pray"
      className="flex h-full w-full flex-col items-center justify-center bg-[#EFEAD7] text-[#293D35]"
    >
      <div className="mx-auto flex max-w-[312px] flex-col items-center gap-y-[24px] text-center">
        <ImgPray />

        <h2 className="font-mono text-[32px]">Ucapan dan Do'a Restu</h2>
        <p className="font-sans text-[12px] font-light">
          Ucapkan Selamat dan Doa Restu Kepada Mempelai Untuk Hari Bahagia Mereka Melalui Kolom
          Berikut :
        </p>

        <form onSubmit={form.handleSubmit(submitHandler)}>
          <div className="mx-auto flex w-[280px] flex-col gap-[8px]">
            <Input
              {...form.register('name')}
              placeholder="Nama"
              className="block rounded-[4px] bg-white"
            />
            <Textarea
              {...form.register('message')}
              placeholder="Ucapan"
              className="block rounded-[4px] bg-white"
            />

            <div className="flex w-full flex-col gap-[6px]">
              <Button disabled={form.formState.isSubmitting} type="submit" variant="2F4539">
                Kirim
              </Button>
              <hr className="opacity-30" />
              <Button disabled={form.formState.isSubmitting} type="button" variant="outline" onClick={onClickSee}>
                Lihat Ucapan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContentPray;
