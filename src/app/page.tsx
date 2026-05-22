'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QueryClient, QueryClientProvider, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function formatWishDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  
  const audio = useRef<HTMLAudioElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);

  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWishes, setShowWishes] = useState(false);

  const queryClientInstance = useQueryClient();

  // ─── RSVP Form ──────────────────────────────────────────────
  const formRsvp = useForm<TCreateRsvpForm>({
    resolver: yupResolver(createRsvpValidation),
    defaultValues: {
      name: '',
      guests: 1,
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
      const signature = searchParams.get('s') ?? undefined;
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, signature }),
      });
      const json: TApiResponse<TPublicWish> = await res.json();

      if (!json.success) {
        toast.error(json.error ?? 'Gagal mengirim ucapan.');
        return;
      }

      toast.success('Ucapan berhasil dikirim! Terima kasih.');
      formWish.reset();

      // Refetch wishes query cache to instantly show the updated list
      queryClientInstance.invalidateQueries({ queryKey: ['wishes'] });
    } catch {
      toast.error('Gagal terhubung ke server.');
    }
  };

  // ─── React Query Infinite Query for Wishes ───────────────────
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['wishes'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/wishes?offset=${pageParam}`);
      const json: TApiResponse<{ wishes: TPublicWish[]; hasMore: boolean }> =
        await res.json();

      if (!json.success || !json.data) {
        throw new Error(json.error ?? 'Gagal memuat ucapan.');
      }
      return json.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.reduce((sum, page) => sum + page.wishes.length, 0);
    },
    enabled: showWishes,
  });

  const publicWishes = data?.pages.flatMap((page) => page.wishes) ?? [];
  const loadingWishes = isLoading || isFetchingNextPage;
  const hasMoreWishes = hasNextPage;

  const { contextSafe } = useGSAP(() => {
    gsap.set('#dec-opening-left', {
      xPercent: -100,
      opacity: 0,
    })
    gsap.to('#dec-opening-left', {
      xPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'sine.inOut',
    });
    gsap.set('#dec-opening-right', {
      xPercent: 100,
      opacity: 0,
    })
    gsap.to('#dec-opening-right', {
      xPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'sine.inOut',
    });
    gsap.set('#img-opening', {
      yPercent: -100,
      opacity: 0,
    })
    gsap.to('#img-opening', {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'sine.inOut',
    });
    gsap.set('#dec-star', {
      yPercent: 100,
      opacity: 0,
    })
    gsap.to('#dec-star', {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'sine.inOut',
    });

    gsap.to('#content-intro-img', {
      x: 'random(-4, 4)',
      y: 'random(-4, 4)',
      rotation: 'random(-1.5, 1.5)',
      duration: 0.6,
      repeat: -1,
      repeatRefresh: true,
      ease: 'sine.inOut',
    });

    gsap.set('#content-bride-img', {
      opacity: 0,
      xPercent: -140,
    })
    gsap.to('#content-bride-img', {
      scrollTrigger: {
        trigger: '#content-bride',
        start: 'top 90%',
        scroller: '#canvas',
        // toggleActions: 'play none none reverse',
      },
      duration: 1,
      xPercent: 0,
      opacity: 1,
      ease: 'power2.out',
    });
    gsap.set('#content-bride-text', {
      opacity: 0,
      yPercent: 140,
    })
    gsap.to('#content-bride-text', {
      scrollTrigger: {
        trigger: '#content-bride',
        start: 'top 50%',
        scroller: '#canvas',
        // toggleActions: 'play none none reverse',
      },
      duration: 1,
      yPercent: 0,
      opacity: 1,
      ease: 'power2.out',
    });

    gsap.set('#content-groom-img', {
      opacity: 0,
      xPercent: 140,
    })
    gsap.to('#content-groom-img', {
      scrollTrigger: {
        trigger: '#content-groom',
        start: 'top 100%',
        scroller: '#canvas',
        // toggleActions: 'play none none reverse',
      },
      duration: 1,
      xPercent: 0,
      opacity: 1,
      ease: 'power2.out',
    });
    gsap.set('#content-groom-text', {
      opacity: 0,
      yPercent: 140,
    })
    gsap.to('#content-groom-text', {
      scrollTrigger: {
        trigger: '#content-groom',
        start: 'top 100%',
        scroller: '#canvas',
        // toggleActions: 'play none none reverse',
      },
      duration: 1,
      yPercent: 0,
      opacity: 1,
      ease: 'power2.out',
    });

    gsap.set('#dec-story', {
      x: 50,
      opacity: 0,
    })
    gsap.to('#dec-story', {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'sine.inOut',
      scrollTrigger: {
        trigger: '#content-story',
        start: 'top 200%',
        scroller: '#canvas',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.set('#img-rsvp', {
      yPercent: 50,
      opacity: 0,
    })
    gsap.to('#img-rsvp', {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'sine.inOut',
      scrollTrigger: {
        trigger: '#content-rsvp',
        start: 'top 300%',
        scroller: '#canvas',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.set('#img-love', {
      yPercent: 50,
      opacity: 0,
    })
    gsap.to('#img-love', {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'sine.inOut',
      scrollTrigger: {
        trigger: '#content-gift',
        start: 'top 400%',
        scroller: '#canvas',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.to('#img-pray', {
      rotation: 'random(-2, 2)',
      duration: 0.6,
      repeat: -1,
      repeatRefresh: true,
    });

    gsap.set('#img-closing', {
      yPercent: -50,
      opacity: 0,
    })
    gsap.to('#img-closing', {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'sine.inOut',
      scrollTrigger: {
        trigger: '#content-closing',
        start: 'top 450%',
        scroller: '#canvas',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: containerRef });

  const handlePlay = () => {
    if (isPlaying) {
      audio.current.pause();
      setIsPlaying(false);
    } else {
      audio.current.play();
      setIsPlaying(true);
    }
  };

  const openFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      // @ts-ignore
    } else if (document.documentElement.webkitRequestFullscreen) {
      // @ts-ignore
      document.documentElement.webkitRequestFullscreen();
      // @ts-ignore
    } else if (document.documentElement.msRequestFullscreen) {
      // @ts-ignore
      document.documentElement.msRequestFullscreen();
    }
  };

  const handleOpen = contextSafe(() => {
    if (navigator.userAgent.indexOf("UCBrowser") != -1 || navigator.userAgent.indexOf("MiuiBrowser") != -1 || navigator.userAgent.includes("OppoBrowser") || navigator.userAgent.includes("HeyTapBrowser")) {
      console.log("Browser not support portrait full screen mode");
    } else {
      openFullScreen();
    }

    gsap.to('#content-opening', {
      yPercent: -100,
      onComplete: () => {
        setIsOpened(true);
        handlePlay();

        const canvas = document.getElementById('canvas');
        if (canvas) canvas.style.overflowY = 'auto';

        // Refresh ScrollTrigger to calculate offsets correctly after element displays block/scroll
        ScrollTrigger.refresh();
      },
    });
  });


  return (
    <LayoutMobile ref={containerRef}>
      <ContentOpening guestName={searchParams.get('kepada') || 'Tamu Undangan'} onClick={handleOpen} />
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

      <audio ref={audio} className="hidden opacity-0 w-0 h-0">
        <source src="/audio.mpeg" type="audio/mpeg" />
      </audio>

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
                onClick={() => fetchNextPage()}
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
