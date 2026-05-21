import { SubmitEventHandler } from 'react';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Controller, UseFormRegister, UseFormReturn } from 'react-hook-form';

import ImgRsvp from './img-rsvp';

type ContentRsvpProps = {
  form: UseFormReturn<any>;
  submitHandler: (data: any) => void;
};

const ContentRsvp = ({ form, submitHandler }: ContentRsvpProps) => {
  return (
    <section
      id="content-rsvp"
      className="flex h-full w-full flex-col items-center justify-center bg-[#EFEAD7] text-[#293D35]"
    >
      <div className="mx-auto flex max-w-[312px] flex-col items-center gap-y-[24px] text-center">
        <ImgRsvp />

        <h2 className="font-mono text-[32px]">RSVP</h2>
        <p className="font-sans text-[12px] font-light">
          Bagi tamu undangan yang akan hadir di acara pernikahan kami silahkan kirimkan konfirmasi
          kehadiran dengan mengisi form berikut :
        </p>

        <form onSubmit={form.handleSubmit(submitHandler)}>
          <div className="mx-auto flex w-[280px] flex-col gap-[16px]">
            <Input
              {...form.register('name')}
              placeholder="Nama Tamu"
              className="block rounded-[4px] bg-white"
            />
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select
                  name={field.name}
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger className="w-full rounded-[4px] bg-white">
                    <SelectValue placeholder="Pilih Status Kehadiran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Tidak Hadir</SelectItem>
                      <SelectItem value="1">1 Orang</SelectItem>
                      <SelectItem value="2">2 Orang</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <Button variant="2F4539" className="w-auto max-w-[82px]">
              Kirim
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContentRsvp;
