import { createConfirmationCreater, createReactTreeMounter, createMountPoint } from 'react-confirm';

const mounter = createReactTreeMounter();

export const createConfirmation = createConfirmationCreater(mounter);
export const MountPoint = createMountPoint(mounter);