/* eslint-disable promise/always-return */
import { IpcRendererEvent } from 'electron';
import { useCallback, useEffect } from 'react';

// WebRTC PeerConnection
const peerConnection = new window.RTCPeerConnection();
const sdpConstraints = { optional: [{ RtpDataChannels: true }] };
let webrtcDataChannel = peerConnection.createDataChannel('BonBon/public_place');
let webrtcOfferFinal;

peerConnection.oniceconnectionstatechange = (e) => {
  const state = peerConnection.iceConnectionState;
  console.log('===== oniceconnectionstatechange =====', { e, state });
};

peerConnection.onicecandidate = (e) => {
  if (e.candidate) {
    console.log('===== onicecandidate =====', e.candidate);
    window.app.chat.sendIceCandidate(JSON.stringify(e.candidate));
  }
};

peerConnection.ondatachannel = (e) => {
  webrtcDataChannel = e.channel;
  webrtcDataChannel.onopen = () => {
    console.log('===== ondatachannel/onopen/connected =====');
  };
  webrtcDataChannel.onmessage = (onMessageEvent) => {
    console.log('onmessage', onMessageEvent.data);
  };
};

export const acceptWebrtcOffer = async (offer: string, senderUsername: string, senderMagic: string) => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  window.app.chat.createdWebrtcAnswer(JSON.stringify(answer), senderUsername, senderMagic)
}

export default () => {
  const createWebrtcParticipantAction = useCallback(
    (_e: IpcRendererEvent, { webrtcOffer, username, magic }: { webrtcOffer: string, username: string, magic: string}) => {
      console.log('===== createWebrtcParticipantAction =====', webrtcOffer);
      peerConnection
        .setRemoteDescription(new RTCSessionDescription(JSON.parse(webrtcOffer)))
        .then(() => peerConnection.createAnswer(sdpConstraints))
        .then((webrtcParticipant) => {
          console.log('===== creating webrtc answer =====', webrtcOffer);
          peerConnection.setLocalDescription(webrtcParticipant);
          console.log('===== created webrtc participant =====', webrtcOffer);
          window.app.chat.createdWebrtcParticipant({
            webrtcParticipant: JSON.stringify(webrtcParticipant),
            username,
            magic
          });
        })
        .catch((e) => console.log(e));
    },
    []
  );

  const createWebrtcOfferAction = useCallback(async () => {
    console.log('===== createWebrtcOfferAction =====');
    webrtcOfferFinal = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(webrtcOfferFinal);
    console.log('===== created WebrtcOfferAction =====');
    window.app.chat.createdWebrtcOffer(JSON.stringify(webrtcOfferFinal));
  }, []);

  const chatConnectionRequestAcceptedAction = useCallback((_e: IpcRendererEvent, { 
    senderUsername,
    senderMagic,
    receiverUsername,
    receiverMagic,
    webrtcAnswer
  }: {senderUsername: string, senderMagic: string, receiverUsername: string, receiverMagic: string, webrtcAnswer: string}) => {
      console.log('===== chatConnectionRequestAcceptedAction =====');
      const answerDesc = new RTCSessionDescription(JSON.parse(webrtcAnswer));
      // Check if the signaling state is correct before setting the remote description
      if (peerConnection.signalingState === "have-local-offer") {
        peerConnection.setRemoteDescription(answerDesc)
          .then(() => {
            console.log('Remote description set successfully');
          })
          .catch((error) => {
            console.error('Error setting remote description:', error);
          });
      } else {
        console.warn('Cannot set remote description. Current signaling state:', peerConnection.signalingState);
      }
    }, [])

  // const webrtcConnectionRequestAction = useCallback(
  //   (_e: IpcRendererEvent, { webrtcParticipant }: {webrtcParticipant: string}) => {
  //     console.log({ webrtcParticipant });
  //     const answerDesc = new RTCSessionDescription(JSON.parse(webrtcParticipant));
  //     peerConnection.setRemoteDescription(answerDesc);
  //   },
  //   []
  // );

  useEffect(() => {
    window.app.listener.createWebrtcOffer(createWebrtcOfferAction);
    return () => window.app.off.createWebrtcOffer();
  }, [createWebrtcOfferAction]);

  useEffect(() => {
    window.app.listener.createWebrtcParticipant(createWebrtcParticipantAction);
    return () => window.app.off.createWebrtcParticipant();
  }, [createWebrtcParticipantAction]);

  // useEffect(() => {
  //   window.app.listener.webrtcConnectionRequest(webrtcConnectionRequestAction);
  //   return () => window.app.off.webrtcConnectionRequest();
  // }, [webrtcConnectionRequestAction]);

  useEffect(() => {
    window.app.listener.chatConnectionRequestAccepted(chatConnectionRequestAcceptedAction);
    return () => window.app.off.chatConnectionRequestAccepted();
  }, [chatConnectionRequestAcceptedAction]);
};
