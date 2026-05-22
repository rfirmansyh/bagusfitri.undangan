import { DATA } from "@/src/constant/data.constant";

export const DEFAULT_CHAT_TEMPLATE = (name: string, inviteLink: string) => `Kepada Yth.
Bapak/Ibu/Saudara/i
${name}

Tanpa mengurangi rasa hormat, melalui pesan digital ini kami bermaksud mengundang Bapak/Ibu untuk hadir dan memberikan doa restu pada acara pernikahan kami.

Informasi lengkap mengenai lokasi dan detail acara dapat Bapak/Ibu akses melalui tautan undangan berikut:
${inviteLink}

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu berkenan hadir di hari bahagia kami.
Terima kasih atas perhatiannya.

Hormat kami,
${DATA.COUPLE_NAME_FORMAL}.`;