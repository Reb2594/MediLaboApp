using DiabetesRiskService.API.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// HttpClient nommé pour appeler PatientService (récupérer âge + genre).
builder.Services.AddHttpClient("PatientService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:PatientServiceUrl"]!);
});

// HttpClient nommé pour appeler NoteService (récupérer les notes du patient).
builder.Services.AddHttpClient("NoteService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:NoteServiceUrl"]!);
});

builder.Services.AddScoped<global::DiabetesRiskService.API.Services.IDiabetesRiskService,
    global::DiabetesRiskService.API.Services.DiabetesRiskService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
