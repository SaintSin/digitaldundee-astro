# CMS Options for Digital Dundee

This document outlines potential CMS solutions for managing content on the Digital Dundee Astro site, with focus on automatic image cropping and resizing capabilities.

## Requirements

- Free tier or open source
- Automatic image cropping and resizing
- User uploads image with any aspect ratio, CMS handles transformation
- Compatible with Astro static site
- Minimal vendor lock-in preferred

## Recommended Options

### 1. Decap CMS (formerly Netlify CMS) - **RECOMMENDED**

**Pros:**

- ✅ Built-in image processing with automatic resizing
- ✅ Image widget supports max dimensions and quality settings
- ✅ Git-based - commits directly to your repo (perfect for current workflow)
- ✅ Free and open source
- ✅ Works great with Netlify (current hosting platform)
- ✅ Image transformations configurable per field
- ✅ No vendor lock-in - content stays in your Git repo
- ✅ Works with existing MDX file structure

**Cons:**

- ⚠️ Image cropping is basic (resize only, not advanced cropping)
- ⚠️ UI is functional but not as modern as some alternatives

**Example Configuration:**

```yaml
collections:
  - name: "news"
    label: "News"
    folder: "src/content/news"
    create: true
    fields:
      - label: "Featured Image"
        name: "imagePrimary"
        widget: "image"
        media_library:
          config:
            max_file_size: 512000
            image_processing:
              - media_type: image
                output_filename_template: "{{filename}}-{{width}}x{{height}}.{{extension}}"
```

**Integration Effort:** Low - Works directly with existing file structure

---

### 2. Cloudinary + Decap CMS

**Pros:**

- ✅ Free tier: 25 GB storage, 25 GB bandwidth/month
- ✅ Advanced image manipulation - crop, resize, format conversion
- ✅ AI-powered cropping (detects faces/objects for smart cropping)
- ✅ Integrates seamlessly with Decap CMS
- ✅ Automatic format optimization (WebP, AVIF)
- ✅ CDN delivery included

**Cons:**

- ⚠️ External service dependency
- ⚠️ Images stored externally, not in Git repo
- ⚠️ Can hit free tier limits with high traffic

**Use Case:** Best for sites needing advanced image manipulation and optimization

**Integration Effort:** Medium - Requires Cloudinary account and Decap CMS config

---

### 3. TinaCMS

**Pros:**

- ✅ Free tier available
- ✅ Git-based workflow
- ✅ Image optimization built-in
- ✅ MDX support (perfect for current content structure)
- ✅ Visual editing with live preview
- ✅ Modern, intuitive UI
- ✅ Active development and community

**Cons:**

- ⚠️ More complex initial setup than Decap
- ⚠️ Image cropping requires additional configuration
- ⚠️ Smaller community than Decap CMS

**Use Case:** Teams wanting visual editing and modern UI

**Integration Effort:** Medium-High - Requires more configuration

---

### 4. Sanity CMS

**Pros:**

- ✅ Generous free tier (3 users, 10GB assets, 1M API requests/month)
- ✅ Powerful image API with automatic cropping (hotspot feature)
- ✅ Real-time collaboration
- ✅ Excellent developer experience
- ✅ Structured content modeling
- ✅ GROQ query language

**Cons:**

- ⚠️ Headless - requires API integration (not Git-based)
- ⚠️ Content stored in Sanity, not your repo
- ⚠️ More significant architectural change
- ⚠️ Vendor lock-in risk

**Use Case:** Projects requiring structured content, collaboration, or moving away from file-based content

**Integration Effort:** High - Significant architectural changes needed

---

## Comparison Matrix

| Feature               | Decap CMS | Cloudinary + Decap | TinaCMS     | Sanity             |
| --------------------- | --------- | ------------------ | ----------- | ------------------ |
| **Cost**              | Free      | Free tier          | Free tier   | Free tier          |
| **Git-based**         | ✅        | ✅                 | ✅          | ❌                 |
| **Image Resize**      | ✅        | ✅                 | ✅          | ✅                 |
| **Image Crop**        | Basic     | Advanced (AI)      | Basic       | Advanced (Hotspot) |
| **No Vendor Lock-in** | ✅        | ⚠️                 | ✅          | ❌                 |
| **Setup Complexity**  | Low       | Medium             | Medium-High | High               |
| **Works with MDX**    | ✅        | ✅                 | ✅          | ⚠️                 |
| **Visual Editing**    | ❌        | ❌                 | ✅          | ✅                 |
| **Real-time Collab**  | ❌        | ❌                 | ⚠️          | ✅                 |

---

## Recommendation for Digital Dundee

**Primary Recommendation: Decap CMS**

Decap CMS is the best fit for Digital Dundee because:

1. **Git-native** - Maintains current file-based workflow with MDX files
2. **Zero vendor lock-in** - All content remains in Git repository
3. **Existing structure compatibility** - Works with current companies/news/events collections
4. **Netlify integration** - Already deployed on Netlify
5. **Free forever** - Open source, no cost concerns
6. **No database required** - Uses Git as the backend
7. **Simple setup** - Can be configured in hours, not days

**Secondary Option:** If advanced image cropping with AI is critical, use **Cloudinary + Decap CMS** combination.

---

## Next Steps

If implementing Decap CMS:

1. Create `/public/admin/` directory
2. Add `config.yml` with collection definitions
3. Add `index.html` for CMS UI
4. Configure Netlify Identity for authentication
5. Test with one collection before rolling out to all

Estimated implementation time: 2-4 hours

---

## Additional Resources

- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [Decap CMS with Astro Guide](https://docs.astro.build/en/guides/cms/decap-cms/)
- [TinaCMS Documentation](https://tina.io/docs/)
- [Sanity + Astro Guide](https://docs.astro.build/en/guides/cms/sanity/)
- [Cloudinary Integration](https://cloudinary.com/documentation)

---

_Document created: 2025-12-12_
