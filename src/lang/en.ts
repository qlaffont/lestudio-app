import { ZodEn } from './zodEn';

export const enI18n = {
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
      isPlaying: 'Music is playing',
      notPlaying: 'Music is not playing',
      notDetected: 'Music not detected',
      incompatible: 'This OS is not compatible, please switch to a Windows !',
    },
  },
  ...ZodEn,
};
