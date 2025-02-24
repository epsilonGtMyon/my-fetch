package epsilongtmyon.app.endpoint.sandbox02;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RequestMapping("/sandbox02")
@RestController
public class Sandbox02Controller {

	@GetMapping("")
	public ModelAndView index() {
		return new ModelAndView("sandbox02/index");
	}

	@PostMapping("/status200")
	public ResponseEntity<?> status200() {

		return ResponseEntity
				.status(HttpStatus.OK)
				.body(Map.of("value01", "hoge"));
	}

	@PostMapping("/status400")
	public ResponseEntity<?> status400() {

		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(Map.of("value01", "hoge"));
	}

	@PostMapping("/status500")
	public ResponseEntity<?> status500() {

		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("value01", "hoge"));
	}

	@GetMapping("/downloadGet")
	public ResponseEntity<Resource> downloadGet() throws IOException {
		return download();
	}

	@PostMapping("/downloadPost")
	public ResponseEntity<Resource> downloadPost() throws IOException {
		return download();
	}

	private ResponseEntity<Resource> download() throws IOException {
		Path path = Path.of(".temp", "あいうえお.xlsx");
		PathResource resource = new PathResource(path);
		
		ContentDisposition contentDisposition = ContentDisposition.attachment()
				.filename(path.getFileName().toString(), StandardCharsets.UTF_8).build();

		return ResponseEntity.ok()
				.contentLength(Files.size(path))
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
				.body(resource);
	}

	@GetMapping("/redirect")
	public ModelAndView redirect() {
		return new ModelAndView("redirect:http://localhost:8080");
	}
}
