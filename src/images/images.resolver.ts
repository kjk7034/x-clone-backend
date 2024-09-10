import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateImageInput } from './dto/create-image.dto';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';

@Resolver(() => Image)
export class ImagesResolver {
  constructor(private readonly imagesService: ImagesService) {}

  @Mutation(() => Image)
  createImage(@Args('createImageInput') createImageInput: CreateImageInput) {
    return this.imagesService.create(createImageInput);
  }

  @Query(() => [Image], { name: 'images' })
  findAll() {
    return this.imagesService.findAll();
  }

  @Query(() => Image, { name: 'image' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.imagesService.findOne(id);
  }

  @Mutation(() => Image)
  removeImage(@Args('id', { type: () => String }) id: string) {
    return this.imagesService.remove(id);
  }
}
