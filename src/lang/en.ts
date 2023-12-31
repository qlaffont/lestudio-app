import { BCP47 } from '../components/modules/captions/utils/langOptions';
import { ZodEn } from './zodEn';

export const enI18n = {
  global: {
    gameList: {
      updated: 'Updated game list !',
      error: 'You are running the last updated game list !',
    },
  },
  pages: {
    home: {
      title: 'Home',
    },
    game: {
      title: 'Current game',
      noDetected: 'Game not detected',
      notFound: {
        title: 'If game not found',
        action: {
          donothing: 'Do nothing',
          justchatting: 'Set to Just Chatting category',
          clear: 'Remove current category',
        },
      },
      addGame: {
        title: 'Add game to detection list',
        form: {
          process: 'Process to add',
          twitchCategoryId: 'Twitch Game or Category',
          action: 'Submit',
          success: 'Thanks for your contribution ! Your game has been added !',
          error: 'Error ! Try again later!',
        },
      },
    },
    settings: {
      title: 'Settings',
      form: {
        userToken: 'User Token',
        helperUserToken: 'You can found this token in Settings > Token',
        action: 'Save',
        errorToken: 'Invalid token !',
        success: 'Token saved !',
      },
      startOnBoot: 'Start minified on system boot',
      close: 'To close this program, you need to right click on system tray and click on Quit.',
    },
    music: {
      title: 'Current music',
      incompatible: 'This OS is not compatible, please switch to a Windows !',
      isPlaying: 'Music is playing',
      notPlaying: 'Music is not playing',
      notDetected: 'Music not detected',
    },
    captions: {
      title: 'Closed captions',
      incompatible: 'This OS is not compatible, please switch to another OS (or update your OS) !',
      OBSConnection: 'OBS Connection :',
      connected: 'Connected',
      notConnected: 'Disconnected',
      lastText: 'Last text',
      form: {
        captionsOBSAddress: 'OBS WebSocket Address & Port',
        captionsOBSAddressHelper: 'In OBS go to Settings > WebSocket Serveur settings > Display connexion information',
        captionsOBSPassword: 'OBS WebSocket Password',
        captionsLanguage: 'Captions Language',
        action: 'Submit',
        success: 'Informations saved !',
      },
      langOptions: {
        [BCP47.AR_SA]: 'Arabic',
        [BCP47.CA_SZ]: 'Czech',
        [BCP47.DA_DK]: 'Danish',
        [BCP47.DE_DE]: 'German',
        [BCP47.EL_GR]: 'Modern Greek',
        [BCP47.EN_AU]: 'English (Australia)',
        [BCP47.EN_GB]: 'English (United Kingdom)',
        [BCP47.EN_IE]: 'English (Ireland)',
        [BCP47.EN_US]: 'English (United States)',
        [BCP47.EN_ZA]: 'English (South Africa)',
        [BCP47.ES_ES]: 'Spanish (Spain)',
        [BCP47.ES_MX]: 'Spanish (Mexico)',
        [BCP47.FI_FI]: 'Finnish',
        [BCP47.FR_CA]: 'French (Canada)',
        [BCP47.FR_FR]: 'French (France)',
        [BCP47.HE_IL]: 'Hebrew',
        [BCP47.HI_IN]: 'Hindi',
        [BCP47.HU_HU]: 'Hungarian',
        [BCP47.ID_ID]: 'Indonesian',
        [BCP47.IT_IT]: 'Italian',
        [BCP47.JA_JP]: 'Japanese',
        [BCP47.KO_KR]: 'Korean',
        [BCP47.NL_BE]: 'Dutch (Belgium)',
        [BCP47.NL_NL]: 'Dutch (Netherlands)',
        [BCP47.NO_NO]: 'Norwegian',
        [BCP47.PL_PL]: 'Polish',
        [BCP47.PT_BR]: 'Portuguese (Brazil)',
        [BCP47.PT_PT]: 'Portuguese (Portugal)',
        [BCP47.RO_RO]: 'Romanian',
        [BCP47.RU_RU]: 'Russian',
        [BCP47.SK_SK]: 'Slovak',
        [BCP47.SV_SE]: 'Swedish',
        [BCP47.TH_TH]: 'Thai',
        [BCP47.TR_TR]: 'Turkish',
        [BCP47.ZH_CN]: 'Chinese (China)',
        [BCP47.ZH_HK]: 'Chinese (Hong Kong)',
        [BCP47.ZH_TW]: 'Chinese (Taiwan)',
      } as Record<BCP47, string>,
    },
  },
  ...ZodEn,
};
