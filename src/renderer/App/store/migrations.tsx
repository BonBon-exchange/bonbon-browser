/* eslint-disable import/prefer-default-export */
export const migrations = {
  2: (state: any) => ({ ...state, board: { ...state.board, closdUrls: [] } }),
};
