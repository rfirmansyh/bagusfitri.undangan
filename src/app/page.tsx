'use client';

import { useCallback, useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/src/components/ui/item';
import { createRsvpValidation, createWishValidation } from '@/src/validations/app.validation';
import type { TApiResponse, TPublicWish, TRsvp } from '@/src/types/app.types';
import type { TCreateRsvpForm, TCreateWishForm } from '@/src/validations/app.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
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

function formatWishDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export default function Home() {
  const [showWishes, setShowWishes] = useState(false);
  const [publicWishes, setPublicWishes] = useState<TPublicWish[]>([]);
  const [loadingWishes, setLoadingWishes] = useState(false);
  const [hasMoreWishes, setHasMoreWishes] = useState(false);

  // ─── RSVP Form ──────────────────────────────────────────────
  const formRsvp = useForm<TCreateRsvpForm>({
    resolver: yupResolver(createRsvpValidation),
    defaultValues: {
      name: '',
      guests: 0,
    },
  });

  const submitHandlerRsvp = async (data: TCreateRsvpForm) => {
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json: TApiResponse<TRsvp> = await res.json();

      if (!json.success) {
        toast.error(json.error ?? 'Gagal mengirim RSVP.');
        return;
      }

      toast.success('RSVP berhasil dikirim! Terima kasih.');
      formRsvp.reset();
    } catch {
      toast.error('Gagal terhubung ke server.');
    }
  };

  // ─── Wish Form ──────────────────────────────────────────────
  const formWish = useForm<TCreateWishForm>({
    resolver: yupResolver(createWishValidation),
    defaultValues: {
      name: '',
      message: '',
    },
  });

  const submitHandlerWish = async (data: TCreateWishForm) => {
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json: TApiResponse<TPublicWish> = await res.json();

      if (!json.success) {
        toast.error(json.error ?? 'Gagal mengirim ucapan.');
        return;
      }

      toast.success('Ucapan berhasil dikirim! Terima kasih.');
      formWish.reset();

      // Prepend new wish to the list if dialog is open
      if (json.data) {
        setPublicWishes((prev) => [json.data!, ...prev]);
      }
    } catch {
      toast.error('Gagal terhubung ke server.');
    }
  };

  // ─── Fetch Public Wishes ───────────────────────────────────
  const fetchWishes = useCallback(async (offset = 0) => {
    setLoadingWishes(true);
    try {
      const res = await fetch(`/api/wishes?offset=${offset}`);
      const json: TApiResponse<{ wishes: TPublicWish[]; hasMore: boolean }> =
        await res.json();

      if (json.success && json.data) {
        if (offset === 0) {
          setPublicWishes(json.data.wishes);
        } else {
          setPublicWishes((prev) => [...prev, ...json.data!.wishes]);
        }
        setHasMoreWishes(json.data.hasMore);
      }
    } catch {
      // Silent fail for public fetch
    } finally {
      setLoadingWishes(false);
    }
  }, []);

  useEffect(() => {
    if (showWishes) {
      fetchWishes(0);
    }
  }, [showWishes, fetchWishes]);

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

          <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
            {publicWishes.length === 0 && !loadingWishes && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Belum ada ucapan.
              </p>
            )}
            {publicWishes.map((wish) => (
              <Item key={wish.id} variant="outline">
                <ItemMedia>
                  <Avatar className="size-10">
                    <AvatarFallback>
                      {wish.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{wish.name}</ItemTitle>
                  <ItemDescription className="text-[12px]">
                    {wish.message}
                  </ItemDescription>
                  <div className="text-[10px]">
                    {formatWishDate(wish.createdAt)}
                  </div>
                </ItemContent>
              </Item>
            ))}
            {hasMoreWishes && (
              <Button
                variant="outline"
                size="sm"
                disabled={loadingWishes}
                onClick={() => fetchWishes(publicWishes.length)}
                className="mt-2"
              >
                {loadingWishes ? 'Memuat...' : 'Muat Lagi'}
              </Button>
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </LayoutMobile>
  );
}
