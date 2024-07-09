import { IpcRendererEvent, ipcRenderer } from 'electron';
import { useCallback, useEffect } from 'react';

// webrtc peerconnection
const peerConnection = new window.RTCPeerConnection();
const sdpConstraints = { optional: [{ RtpDataChannels: true }] };
let webrtcDataChannel: RTCDataChannel = peerConnection.createDataChannel(
  'BonBon/public_place'
);
let webrtcOffer;

peerConnection.oniceconnectionstatechange = function (e: unknown) {
  const state = peerConnection.iceConnectionState;
  console.log('oniceconnectionstatechange', { e, state });
};

peerConnection.onicecandidate = function (e) {
  console.log('onicecandidate', { e });
};

peerConnection.ondatachannel = function (e) {
  webrtcDataChannel = e.channel;
  webrtcDataChannel.onopen = () => {
    console.log('ondatachannel/onopen/connected');
  };
  webrtcDataChannel.onmessage = function (onMessageEvent) {
    console.log('onmessage', { onMessageEvent });
  };
};

export default () => {
  const createWebrtcParticipantAction = useCallback(
    (_e: IpcRendererEvent, args: { webrtcOffer: string; username: string }) => {
      peerConnection.setRemoteDescription(
        args.webrtcOffer as unknown as RTCSessionDescriptionInit
      );
      peerConnection
        .createAnswer(sdpConstraints)
        .then((webrtcParticipant) => {
          peerConnection.setLocalDescription(webrtcParticipant);
          ipcRenderer.send('created-webrtc-participant', { webrtcParticipant });
          return true;
        })
        .catch((e: unknown) => {
          console.log({ e });
        });
    },
    []
  );

  const createWebrtcOfferAction = useCallback(async () => {
    webrtcOffer = await peerConnection.createOffer();
    ipcRenderer.send('created-webrtc-offer', webrtcOffer);
    return webrtcOffer;
  }, []);

  const webrtcConnectionRequestAction = useCallback(
    (_e: IpcRendererEvent, args: { webrtcParticipant: string }) => {
      const answerDesc = new RTCSessionDescription(
        JSON.parse(args.webrtcParticipant)
      );
      peerConnection.setRemoteDescription(answerDesc);
    },
    []
  );

  useEffect(() => {
    window.app.listener.createWebrtcOffer(createWebrtcOfferAction);
    return () => window.app.off.createWebrtcOffer();
  }, [createWebrtcOfferAction]);

  useEffect(() => {
    window.app.listener.createWebrtcParticipant(createWebrtcParticipantAction);
    return () => window.app.off.createWebrtcParticipant();
  }, [createWebrtcParticipantAction]);

  useEffect(() => {
    window.app.listener.webrtcConnectionRequest(webrtcConnectionRequestAction);
    return () => window.app.off.webrtcConnectionRequest();
  }, [webrtcConnectionRequestAction]);
};
