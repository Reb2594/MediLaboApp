using AuthService.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private static readonly IPasswordHasher<string> _hasher = new PasswordHasher<string>();

        private record UserRecord(string Username, string HashedPassword, string Role);

        private static readonly List<UserRecord> _users;

        static AuthController()
        {
            _users = new List<UserRecord>
            {
                new("admin",   _hasher.HashPassword("admin",  "Admin1234!"),  "Admin"),
                new("doctor",  _hasher.HashPassword("doctor", "Doctor1234!"), "Practitioner")
            };
        }

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _users.FirstOrDefault(u => u.Username == request.Username);
            if (user is null)
                return Unauthorized("Identifiants incorrects.");

            var result = _hasher.VerifyHashedPassword(user.Username, user.HashedPassword, request.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Identifiants incorrects.");

            var token = GenerateJwtToken(user.Username, user.Role);
            return Ok(new { token });
        }

        private string GenerateJwtToken(string username, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}