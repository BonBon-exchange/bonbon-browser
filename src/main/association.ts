/* eslint-disable import/prefer-default-export */
import { app } from 'electron';
import { Registry } from 'rage-edit';

export const makeAssociation = () => {
  app.setAsDefaultProtocolClient('http');
  app.setAsDefaultProtocolClient('https');
  app.setAsDefaultProtocolClient('bonbon');

  if (process.platform === 'win32') {
    (async () => {
      await Registry.set(
        'HKCU\\Software\\BonBon\\Capabilities',
        'ApplicationName',
        'BonBon'
      );
      await Registry.set(
        'HKCU\\Software\\BonBon\\Capabilities',
        'ApplicationDescription',
        'BonBon'
      );

      await Registry.set(
        'HKCU\\Software\\BonBon\\Capabilities\\URLAssociations',
        'https',
        'BonBon.https'
      );

      await Registry.set(
        'HKCU\\Software\\BonBon\\Capabilities\\URLAssociations',
        'https',
        'BonBon.http'
      );

      await Registry.set(
        'HKCU\\Software\\Classes\\BonBon.https\\DefaultIcon',
        '',
        process.execPath
      );

      await Registry.set(
        'HKCU\\Software\\Classes\\BonBon.http\\DefaultIcon',
        '',
        process.execPath
      );

      await Registry.set(
        'HKCU\\Software\\Classes\\BonBon.https\\shell\\open\\command',
        '',
        `"${process.execPath}" "%1"`
      );

      await Registry.set(
        'HKCU\\Software\\Classes\\BonBon.http\\shell\\open\\command',
        '',
        `"${process.execPath}" "%1"`
      );

      await Registry.set(
        'HKCU\\Software\\RegisteredApplications',
        'BonBon',
        'Software\\BonBon\\Capabilities'
      );
    })();
  }
};
