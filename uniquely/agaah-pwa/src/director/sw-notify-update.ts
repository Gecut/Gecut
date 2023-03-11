import {eventListener} from '@alwatr/signal';
import {snackbarSignalTrigger} from '@gecut/ui-kit/snackbar/controller.js';
import {delay} from '@alwatr/util';

eventListener.subscribe('service_worker_registered', async () => {
  const newVersion = localStorage.getItem('version');

  if (newVersion !== null) {
    snackbarSignalTrigger.request({
      message: `به نسخه ${newVersion.replace('-beta', ' بتا ')} خوش‌آمدید.`,
    });
  }
});

eventListener.subscribe(
  'service_worker_installed',
  () =>
    void snackbarSignalTrigger.request({
      message: 'برنامه نصب شد و اکنون به صورت آفلاین در دسترس است.',
    }),
);

eventListener.subscribe('service_worker_updated', async () => {
  const response = await snackbarSignalTrigger.requestWithResponse({
    message: 'نسخه جدید این برنامه نصب و هم‌اکنون در دسترس است.',
    actionLabel: 'به‌روزرسانی',
    duration: -1,
  });

  if (response.actionButton) {
    await delay(500);
    window.location.reload();
  }
});
