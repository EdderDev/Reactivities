using Application.Activities.Queries;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
builder.Services.AddMediatR(x =>
{
    x.LicenseKey = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ikx1Y2t5UGVubnlTb2Z0d2FyZUxpY2Vuc2VLZXkvYmJiMTNhY2I1OTkwNGQ4OWI0Y2IxYzg1ZjA4OGNjZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x1Y2t5cGVubnlzb2Z0d2FyZS5jb20iLCJhdWQiOiJMdWNreVBlbm55U29mdHdhcmUiLCJleHAiOiIxODE3NTEwNDAwIiwiaWF0IjoiMTc4NjAyNDAyOCIsImFjY291bnRfaWQiOiIwMTlmZDc1MzgwMzE3NTY3ODg4Njc2MmEyNGNjMTkwMSIsImN1c3RvbWVyX2lkIjoiMDE5ZmQ3NTM4MDMxNzU2Nzg4ODY3NjJhMjRjYzE5MDEiLCJzdWJfaWQiOiItIiwiZWRpdGlvbiI6IjAiLCJ0eXBlIjoiMiJ9.JR6Cxo3PlM9BFcJ1dH7WbCEfzGvCUg3H8AiazXE7Wh-54pzS8k8A0Fqr5KwRwH4tdCYVv0JGt5C2YPaVK7c5LEkeWx0eiLCzME-H3-6tkUKz1qpK4k6fXSQMPByF721D8V2SaTsdhWZR_ftTD9dLiJOhVo1s9hWeLOGAusLxSSvWjRyR2WaR14IFU1Wa0DDzSe0O9OGt6bPJutLOd7Ch_3MQ8VwzjNOccKuvAV5JHinRmVOMcNy9hgGz3cPiSFweORVaIAVgybMS5btBRXg2Df2CC7HXkKaH8YncW6f1Cb9q0CGHYzf8KwIzEfd5Ahc2bitGyGCKG045U8DtHmLChw";
    x.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();
});

builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

var app = builder.Build();

// Configure the HTTP request pipeline.

//Cors needs to be set before the map controllers
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000", "https://localhost:3000"));

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DbInitializer.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
