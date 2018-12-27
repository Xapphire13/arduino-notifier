using System;
using System.Collections.Generic;
using System.IO;
using Outlook = Microsoft.Office.Interop.Outlook;

namespace OutlookNotifier
{
    public class Program
    {
        private static int unreadCount = -1;

        public static void Main(string[] args)
        {
            using (var output = Console.OpenStandardOutput())
            {
                var app = new Outlook.Application();
                var inbox = app.Session.GetDefaultFolder(Outlook.OlDefaultFolders.olFolderInbox);
                OnUnreadCountChange(output, inbox.UnReadItemCount);

                inbox.Items.ItemChange += item => OnUnreadCountChange(output, inbox.UnReadItemCount);
                app.Reminder += item => OnReminder(output, item);
                
                Console.ReadLine();
            }
        }

        public static void OnUnreadCountChange(Stream output, int unreadCount)
        {
            if (Program.unreadCount != unreadCount)
            {
                Program.unreadCount = unreadCount;
                var buff = new List<byte>
                {
                    (byte)ControlCode.UnreadCount
                };
                buff.AddRange(BitConverter.GetBytes(unreadCount));

                output.Write(buff.ToArray());
            }
        }

        public static void OnReminder(Stream output, object item)
        {
            if (item is Outlook.AppointmentItem appointment)
            {
                output.Write(new byte[] { (byte)ControlCode.Reminder });
            }
        }

        private enum ControlCode
        {
            UnreadCount = 0x01,
            Reminder = 0x02,
        }
    }
}
