using System;

namespace ReactSignalRChat
{
    public class PlateRead
    {
        public DateTime Date { get; set; }

        public int PlateNumber { get; set; }

        public int TemperatureF => 32 + (int)(PlateNumber / 0.5556);

        public string Summary { get; set; }
    }
}
