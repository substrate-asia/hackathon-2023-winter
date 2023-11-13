using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Substrate.Hexalem.WebAPI.Data
{
    public class ApiContext : DbContext
    {
        public DbSet<Config> Configs { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Board> Boards { get; set; }

        public ApiContext(DbContextOptions<ApiContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define the relationship between Board and Player
            modelBuilder.Entity<Board>()
                .HasMany(b => b.Players)
                .WithOne(p => p.Board)
                .HasForeignKey(p => p.BoardId)
                .IsRequired(false);

            modelBuilder.Entity<Player>()
                .HasOne(p => p.Board)
                .WithMany(b => b.Players)
                .HasForeignKey(p => p.BoardId)
                .IsRequired(false);

            //modelBuilder.Entity<Board>()
            //    .HasCheckConstraint("CK_Board_Players", "Players.Count >= 1");
        }
    }

    public class Config
    {
        [Key]
        public int Id { get; set; }
        public DateTime Genesis { get; set; }
    }

    public class Player
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        // Nullable Foreign Key for Board
        public int? BoardId { get; set; }

        [JsonIgnore]
        // Navigation property for EF Core
        public Board Board { get; set; }
    }

    public class Board
    {
        [Key]
        public int Id { get; set; }

        public string BoardValue { get; set; }
        public string SelectionBase { get; set; }
        public string SelectionCurrent { get; set; }

        // Collection of players in this board
        public ICollection<Player> Players { get; set; }
    }
}
