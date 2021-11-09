export const imageUrlMatchRegex = new RegExp(
  /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i
);

export const urlMatchRegex = new RegExp(
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/i
);

export const youtubeUrlMatchRegex = new RegExp(
  /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i
);

export const specialUrlMatchers = [imageUrlMatchRegex, youtubeUrlMatchRegex];
