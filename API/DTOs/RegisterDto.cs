using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public string DisplayName { get; set; } = "";
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    // No need to use required here as astnet.identity is gonna enforce the complex password anyways
    public string Password { get; set; } = "";
}