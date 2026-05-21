'use client';

import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/src/components/ui/item';
import { createRsvpValidation, createWishValidation } from '@/src/validations/app.vaidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Avatar, AvatarFallback } from '../components/ui/avatar';
import ContentBride from './_components/content-bride';
import ContentClosing from './_components/content-closing';
import ContentDate from './_components/content-date';
import ContentGift from './_components/content-gift';
import ContentGroom from './_components/content-groom';
import ContentIntro from './_components/content-intro';
import ContentPray from './_components/content-pray';
import ContentRsvp from './_components/content-rsvp';
import ContentStory from './_components/content-story';
import LayoutMobile from './_components/layout-mobile';
import ContentOpening from './_components/opening';

export default function Home() {
  const [showWishes, setShowWishes] = useState(false);

  const formRsvp = useForm({
    resolver: yupResolver(createRsvpValidation),
    defaultValues: {
      name: '',
      status: 0,
    },
  });
  const submitHandlerRsvp = (data: any) => {
    console.log('onSubmitRsvp', data);
  };

  const formWish = useForm({
    resolver: yupResolver(createWishValidation),
    defaultValues: {
      name: '',
      message: '',
    },
  });
  const submitHandlerWish = (data: any) => {
    console.log('onSubmitWish', data);
  };

  return (
    <LayoutMobile>
      <ContentOpening />
      <ContentIntro />
      <ContentBride />
      <ContentGroom />
      <ContentDate />
      <ContentStory />
      <ContentRsvp form={formRsvp} submitHandler={submitHandlerRsvp} />
      <ContentGift />
      <ContentPray
        form={formWish}
        submitHandler={submitHandlerWish}
        onClickSee={() => setShowWishes(true)}
      />
      <ContentClosing />

      <Dialog open={showWishes} onOpenChange={setShowWishes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menampilkan Ucapan</DialogTitle>
          </DialogHeader>
          <hr className="opacity-30" />

          <ul>
            <Item variant="outline">
              <ItemMedia>
                <Avatar className="size-10">
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Evil Rabbit</ItemTitle>
                <ItemDescription className="text-[12px]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum sed ratione
                  tempore veniam deleniti animi. Non modi ipsam similique porro!
                </ItemDescription>
                <div className="text-[10px]">20 Mei 2026</div>
              </ItemContent>
            </Item>
          </ul>
        </DialogContent>
      </Dialog>
    </LayoutMobile>
  );
}
