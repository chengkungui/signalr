using System;

namespace ReactSignalRChat
{
    public class PlateRead
    {
        public Guid TransactionId { get; set; }

        public string LicencePlate { get; set; }

        public byte[] Image { get; set; }
        public byte[] PlatePatch { get; set; }

        public PlateMatch Match { get; set; } = PlateMatch.Undicided;
    }

    public enum PlateMatch
    {
        Undicided,
        Match,
        Unmatch
    }
}
